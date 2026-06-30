# Claude Code Instructions - Valter (Expo/React Native)

## Response Pattern (MANDATORY)

Before writing ANY code, explain your plan:

### Overview & Context
[Brief explanation of WHAT needs to be done and WHY]

### Proposed Approach
[Technical approach and WHY this is the best solution]

### Files Affected

#### Created Files:
- `path/to/file.tsx`
    - **Purpose**: [What this file does]
    - **Why needed**: [Reason for creating it]

#### Modified Files:
- `path/to/existing-file.tsx`
    - **What changes**: [Specific modifications]
    - **Why changing**: [Reason for the change]

### Implementation Steps

1. **[Action Name]**
    - Location: `path/to/file`
    - What: [Specific changes]
    - Why: [Reason for this step]
2. **[Next Action]**
    - ...

### Any questions for me before implementing?
[List doubts or clarifications needed]

**Only proceed with code after I confirm the plan.**

---

## Tech Stack

- **Framework**: Expo SDK 53 + React Native 0.79 (New Architecture enabled)
- **Routing**: Expo Router (file-based)
- **Language**: TypeScript (strict mode)
- **Styling**: NativeWind v4 (Tailwind CSS) + Gluestack UI
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios with interceptors
- **Auth**: JWT (access + refresh tokens) via expo-secure-store
- **State**: React Context (no Redux/Zustand)
- **Testing**: Jest + React Native Testing Library
- **Animations**: Legendapp Motion + Reanimated

---

## Architecture

```
valter-expo/
├── app/                           # Expo Router (routing only)
│   ├── _layout.tsx                # Root: providers (Session, GluestackUI)
│   ├── index.tsx                  # Redirect based on auth state
│   └── (app)/
│       ├── (access)/              # Unauthenticated screens
│       │   ├── index.tsx          # Sign in route
│       │   └── signup.tsx         # Sign up route
│       └── (inside)/              # Authenticated screens
│           └── (tabs)/            # Tab navigation
│               ├── _layout.tsx    # Custom tab bar
│               ├── index.tsx      # Shoplist (home)
│               ├── pantry.tsx     # Pantry
│               ├── notification.tsx
│               └── profile.tsx
│
├── ui/                            # UI layer
│   ├── components/                # Reusable components (Gluestack-based)
│   │   ├── Screen.tsx             # Screen wrapper
│   │   ├── box/
│   │   ├── button/
│   │   ├── form/input/            # Input with react-hook-form integration
│   │   ├── text/
│   │   ├── products-list/         # Domain-specific shared components
│   │   └── ...
│   ├── providers/
│   │   ├── session/               # Auth state (context + provider)
│   │   └── gluestack-ui-provider/ # Theme config (light/dark)
│   └── screens/                   # Screen implementations
│       ├── access/                # Auth screens (signin, signup)
│       └── inside/                # App screens (shoplist, pantry, ...)
│
├── services/                      # API service layer
│   ├── auth/
│   ├── shoplist/
│   ├── pantry/
│   ├── product/
│   ├── notification/
│   ├── user/
│   └── enums.ts                   # Shared enums (ITEM_STATE, etc.)
│
├── common/                        # Cross-cutting concerns
│   ├── api/                       # Axios instance, interceptors, reauthentication
│   ├── errors/                    # HttpError class
│   ├── permission/                # Permission enums/types
│   ├── secure-store/              # SecureStore key constants
│   ├── testing/                   # Test utilities (customRender, mocks)
│   └── utils/                     # Shared utilities
│
└── hooks/                         # Custom React hooks
    └── use-session.ts
```

**CRITICAL**:
- `app/` contains ONLY routing files (layouts + route wrappers). No business logic.
- `ui/screens/` contains the actual screen implementations.
- `services/` is the ONLY place for API calls.

---

## Screen Pattern: Container/Presentational

Every screen follows this structure:

```
ui/screens/[area]/[screen]/
├── index.tsx                      # Container (smart component)
├── presentational/
│   └── index.tsx                  # Presentational (dumb component)
├── schema.ts                      # Zod validation schema
└── enum.ts                        # Form field name constants
```

### Container (`index.tsx`)

Handles: data fetching, form setup, business logic, API calls, toast notifications.

```typescript
import {zodResolver} from "@hookform/resolvers/zod";
import {useFieldArray, useForm} from "react-hook-form";
import {useSession} from "../../../../hooks/use-session";
import {findShoplist, updateShoplist} from "../../../../services/shoplist";
import Screen from "../../../components/Screen";
import ShoplistPresentational from "./presentational";
import {ShoplistItemsSchema, ShoplistItemsSchemaType} from "./schema";

const Shoplist = () => {
    const {currentProfile} = useSession();
    const [loading, setLoading] = useState(false);
    const {control, reset, getValues} = useForm({
        resolver: zodResolver(ShoplistItemsSchema),
    });

    const {fields: shoplistItems} = useFieldArray({
        control, name: "shoplistItems", keyName: "key",
    });

    const fetchShoplistItems = useCallback(async () => {
        setLoading(true);
        const shoplist = await findShoplist({id: currentProfile?.shoplist.id!});
        reset({shoplistItems: buildShoplistItems(shoplist.items)});
        setLoading(false);
    }, [reset, currentProfile]);

    useEffect(() => { fetchShoplistItems() }, [fetchShoplistItems]);

    return (
        <Screen loading={loading}>
            <ShoplistPresentational
                control={control}
                shoplistItems={shoplistItems}
                refreshShoplist={fetchShoplistItems}
            />
        </Screen>
    );
};
```

### Presentational (`presentational/index.tsx`)

Handles: rendering UI, receiving data and callbacks via props. No business logic.

```typescript
type ShoplistPresentationalProps = {
    control: Control<ShoplistItemsSchemaType>;
    shoplistItems: ShoplistItemsSchemaType['shoplistItems'];
    refreshShoplist: () => void;
};

const ShoplistPresentational: React.FC<ShoplistPresentationalProps> = ({
    control, shoplistItems, refreshShoplist,
}) => {
    return (
        <VStack className={'w-full h-full'}>
            <FlatList
                data={shoplistItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item, index}) => (
                    <ShoplistItemBox item={item} index={index} control={control} />
                )}
            />
        </VStack>
    );
};
```

### Schema (`schema.ts`)

Single source of truth for form validation. Types are inferred from Zod.

```typescript
import {z} from "zod";

export const ShoplistItemsSchema = z.object({
    shoplistItems: z.array(z.object({
        id: z.string(),
        productId: z.string(),
        portion: z.string(),
        portionType: z.string(),
        state: z.string(),
        name: z.string(),
        validForDays: z.number().optional(),
    })),
});

export type ShoplistItemsSchemaType = z.infer<typeof ShoplistItemsSchema>;
```

### Form Keys (`enum.ts`)

Constants for dynamic form field names (used with `useFieldArray`).

```typescript
export const FormKeys = {
    shoplistItemsPortion: (index: number) => `shoplistItems.${index}.portion`,
    shoplistItemsPortionType: (index: number) => `shoplistItems.${index}.portionType`,
};
```

---

## Service Layer

Each service directory: `index.ts` (API methods) + `type.ts` (request/response types).

```typescript
// services/shoplist/index.ts
import request from "../../common/api/request";
import {FindShoplistParams, FindShoplistResponse} from "./type";

const rootPath = '/shoplist';
const pathBuilder = (path: string) => `${rootPath}${path}`;

export const findShoplist = async ({id}: FindShoplistParams): Promise<FindShoplistResponse> => {
    try {
        const response = await request.get(pathBuilder(`/${id}`));
        return response.data;
    } catch (err) {
        return Promise.reject(err);
    }
};
```

```typescript
// services/shoplist/type.ts
export type FindShoplistParams = { id: string };
export type FindShoplistResponse = {
    id: string;
    name: string;
    items: ShoplistItem[];
};
export type ShoplistItem = FindShoplistResponse['items'][number];
```

---

## API Client (`common/api/request.js`)

- Axios instance with `baseURL` from env vars (`EXPO_PUBLIC_API_URL`)
- **Request interceptor**: injects Bearer token from SecureStore
- **Response interceptor**: handles 401 with automatic token refresh + request retry queue
- Wraps errors in `HttpError`

---

## Naming Standards

| Element | Convention | Example |
|---------|-----------|---------|
| Files/Folders | `kebab-case` | `portion-input/` |
| Components | `PascalCase` | `ShoplistPresentational` |
| Functions/Vars | `camelCase` | `fetchShoplistItems` |
| Types/Interfaces | `PascalCase` | `ShoplistItem` |
| Enum objects | `UPPER_SNAKE_CASE` | `ITEM_STATE` |
| Env vars | `EXPO_PUBLIC_*` | `EXPO_PUBLIC_API_URL` |
| Form keys | `camelCase` | `FormKeys.shoplistItemsPortion` |
| Test files | `index.unit.test.tsx` / `index.integration.test.tsx` | |

**Language**: All code in **ENGLISH**. UI text in **Portuguese (pt-BR)**.

---

## Styling: NativeWind (Tailwind)

Components use `className` with Tailwind utilities. Variants via `tva` (Tailwind Variants).

```typescript
// Inline usage
<VStack className={'w-full h-full bg-white p-2 rounded-tl-3xl'}>

// Variant-based styling (in component styles.tsx)
import {tva} from '@gluestack-ui/nativewind-utils/tva';

export const textStyle = tva({
    base: 'text-typography-700 font-body',
    variants: {
        bold: { true: 'font-bold' },
        size: { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
        h1: { true: 'text-4xl font-bold color-primary-400' },
    },
});
```

Theme colors are CSS variables defined in `ui/providers/gluestack-ui-provider/config.ts` with light/dark mode support.

---

## State Management

- **Global auth state**: `SessionContext` via `ui/providers/session/`
- **Hook**: `useSession()` returns `{ isAuthenticated, currentProfile, signIn, signOut }`
- **Form state**: `react-hook-form` with `useForm` / `useFieldArray`
- **Local UI state**: `useState` in container components
- **No external state library** (no Redux, Zustand, etc.)

---

## Testing

```typescript
// Imports
import {fireEvent, waitFor} from '@testing-library/react-native';
import {customRender} from '../../../../common/testing/base-test-setup';

// Mock services and hooks
jest.mock('../../../../services/shoplist');
jest.mock('../../../../hooks/use-session', () => ({
    useSession: jest.fn(),
}));

describe('Shoplist', () => {
    beforeEach(() => {
        (useSession as jest.Mock).mockReturnValue({ signIn: jest.fn() });
        jest.clearAllMocks();
    });

    it('should render items', async () => {
        const {getByText} = customRender(<Shoplist />);
        await waitFor(() => expect(getByText('Arroz')).toBeTruthy());
    });
});
```

- Use `customRender` (wraps with providers) instead of bare `render`
- Mock all external dependencies (services, hooks)
- `testID` props for interactive elements
- `waitFor` for async operations

---

## Enums

Constant objects with derived types. Located in `services/enums.ts` or co-located with related service types.

```typescript
export const ITEM_STATE = {
    IN_CART: 'IN_CART',
    REMOVED: 'REMOVED',
    IN_PANTRY: 'IN_PANTRY',
    PURCHASED: 'PURCHASED',
    UPDATED: 'UPDATED'
};
export type ItemState = (typeof ITEM_STATE)[keyof typeof ITEM_STATE];
```

---

## New Feature Checklist

- [ ] Screen: `ui/screens/[area]/[name]/` with container + presentational + schema + enum
- [ ] Route: add route file in `app/(app)/...`
- [ ] Service: `services/[name]/index.ts` + `type.ts`
- [ ] Types: typed params and responses in service `type.ts`
- [ ] Forms: Zod schema + `useForm` with `zodResolver`
- [ ] Tab (if needed): register in `app/(app)/(inside)/(tabs)/_layout.tsx`
- [ ] Enums: add to `services/enums.ts` (if shared) or co-locate
- [ ] Tests: `index.unit.test.tsx` or `index.integration.test.tsx`
- [ ] All code in English, UI text in Portuguese
- [ ] No magic values - use enum constants

---

## Common Mistakes

1. Putting business logic in `app/` route files -> use `ui/screens/` container
2. Putting API calls outside `services/` -> always go through service layer
3. Skipping the presentational component -> always separate container/presentational
4. Using bare `render` in tests -> use `customRender` with providers
5. Hardcoding strings for item states -> use `ITEM_STATE` enum
6. Creating inline Zod schemas -> put in `schema.ts` with exported type
7. Missing `type.ts` in service directories -> always type request/response

---

**Suggest improvements** respecting KISS, DRY, SRP, YAGNI when reviewing code.