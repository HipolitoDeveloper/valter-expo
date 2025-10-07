const NotificationType = {
    PRODUCT_EXPIRES: 'PRODUCT_EXPIRES'
};

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

export type GetNotificationsResponse = {
    data: {
        id: string;
        isRead: boolean;
        type: NotificationType;
        expiresDetails?: {
            product: {
                name: string;
            };
            isExpired: boolean;
            isOut: boolean;
            daysSinceLastPurchase: number;
        };
    }[];
    totalCount: number;
};

export type HandleReadNotificationBody = {
    ids: string[];
    isRead: boolean;
}

export type HandleNotificationExpiresDetailsBody = {
    id: string;
    isOut: boolean;
    isExpired: boolean;
}

export type UpdateResponse = {
    id: string;
    isRead: boolean;
    type: NotificationType;
    expiresDetails?: {
        product: {
            name: string;
        };
        isExpired: boolean;
        isOut: boolean;
        daysSinceLastPurchase: number;
    };
};
