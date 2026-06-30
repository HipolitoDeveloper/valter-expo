import {useCallback, useEffect, useState} from "react";
import HttpError from "../../../../common/errors/http-error";
import {getNotifications, handleNotificationExpiresDetails} from "../../../../services/notification";
import {GetNotificationsResponse} from "../../../../services/notification/type";
import Screen from "../../../components/Screen";
import NotificationPresentational from "./presentational";
import ProfilePresentational from "./presentational";

const Notification = () => {
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState<GetNotificationsResponse['data']>([])

    const fetchNotifications = useCallback(async () => {
        setLoading(true)
        try {
            const notificationsResponse = await getNotifications();

            setNotification(notificationsResponse.data)

            setLoading(false)
        } catch (error) {
            if (error instanceof HttpError) {
                console.log("findAllNotifications Error", error)
            } else {
                console.log("findAllNotifications Error", error)
            }
            setLoading(false)
        }
    }, []);

    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications]);

    const handleDetails = async (notificationId: string, isOut: boolean, isExpired: boolean) => {
        setLoading(true)
        try {
             await handleNotificationExpiresDetails({
                 id: notificationId,
                 isOut,
                 isExpired
             });

            fetchNotifications()
            setLoading(false)
        } catch (error) {
            if (error instanceof HttpError) {
                console.log("handleNotificationExpiresDetails Error", error)
            } else {
                console.log("handleNotificationExpiresDetails Error", error)
            }
            setLoading(false)
        }
    }

    return (
        <Screen className={'justify-between'} backgroundColor={'rgb(246 246 246)'} loading={loading}>
            <NotificationPresentational
                notifications={notification}
                handleDetails={handleDetails}
                onRefresh={fetchNotifications}
            />
        </Screen>
    )
}

export default Notification;