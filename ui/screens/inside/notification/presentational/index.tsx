import React from "react";
import {Control} from "react-hook-form";
import {ITEM_STATE, ItemState} from "../../../../../services/enums";
import {GetNotificationsResponse} from "../../../../../services/notification/type";
import {Box} from "../../../../components/box";
import {Button, ButtonIcon} from "../../../../components/button";
import {HStack} from "../../../../components/hstack";
import {AddIcon, RemoveIcon, RepeatIcon, TrashIcon} from "../../../../components/icon";
import PortionInput from "../../../../components/products-list/portion-input/portion-input";
import PortionTypeSelector from "../../../../components/products-list/portion-type-selector/portion-type-selector";
import Screen from "../../../../components/Screen";
import {Text} from "../../../../components/text";
import {VStack} from "../../../../components/vstack";
import {FormKeys} from "../../pantry/enum";
import {PantryItemsSchemaType} from "../../pantry/schema";

type NotificationItemBoxProps = {
    index: number;
    notification: GetNotificationsResponse['data'][number];
    handleDetails: (notificationId: string, isOut: boolean, isExpired: boolean) => void;

}


const NotificationItemBox = ({
                                 notification,
                                 handleDetails
                             }: NotificationItemBoxProps) => {


    return (
        <HStack className={'h-16 justify-between items-center '}>

            <HStack className={'w-1/6 h-full justify-start items-center'}>
                <Button variant={'invisible'}
                        action={'negative'}
                        size={'sm'}
                        testID={`remove-button-${notification.id}`}
                        onPress={() => handleDetails(notification.id, true, false)}>
                    <Text size={'sm'}>Expirado</Text>
                    <ButtonIcon as={RemoveIcon}/>
                </Button>
            </HStack>
            <VStack className={'w-3/6 h-full justify-center items-start'}>
                <Text size={'xl'}>
                    <Text className={'font-bold'}>{notification.expiresDetails?.product.name}</Text> está possivelmente
                    expirado ou fora da data de validade.
                    Confirme seu estado atual
                </Text>
            </VStack>
            <HStack className={'w-1/6 h-full justify-end items-center'} space={'md'}>

                <Button variant={'invisible'}
                        action={'primary'}
                        testID={`add-to-cart-button-${notification.id}`}
                        onPress={() => handleDetails(notification.id, false, true)}>
                    <Text size={'sm'}>Vencido</Text>
                    <ButtonIcon as={RepeatIcon}/>
                </Button>
            </HStack>
        </HStack>
    )

}

type NotificationPresentationalProps = {
    notifications: GetNotificationsResponse['data'];
    handleDetails: (notificationId: string, isOut: boolean, isExpired: boolean) => void;

}

const NotificationPresentational: React.FC<NotificationPresentationalProps> = ({
                                                                                   notifications, handleDetails
                                                                               }) => {
    return (
        <>
            <VStack className={'w-full h-full '}>
                <VStack space={'xl'} className={'w-full flex-[10] bg-white p-2 rounded-tl-3xl rounded-tr-3xl'}>

                    <Box className={'px-4 pt-2'}>
                        <Text size={'lg'} className={'font-black'}>
                            Notificações
                        </Text>
                    </Box>
                    <VStack space={'md'} className={'flex-[9.5]'}>
                        {notifications?.length !== 0 ? (
                            notifications.map((notification, index) => (
                                <NotificationItemBox key={notification.id}
                                                     notification={notification}
                                                     index={index}
                                                     handleDetails={handleDetails}

                                />
                            ))) : (
                            <VStack className={'flex-1 justify-center '}>
                                <Text size={'lg'} className={'font-black text-center'}>
                                    Não há notificações para mostrar
                                </Text>
                            </VStack>
                        )}
                    </VStack>
                </VStack>
            </VStack>
        </>
    );
}

export default NotificationPresentational