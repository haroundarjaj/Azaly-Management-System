import { SaveAs, ThumbUpAlt, DeliveryDining, CheckCircle, Cancel } from '@mui/icons-material';

export default function GenerateOrderStates(t) {
    return [
        {
            name: t("registered"),
            value: "registered",
            description: t("registred_description"),
            icon: <SaveAs style={{ color: "#cecece", marginRight: 20 }} />
        },
        {
            name: t("confirmed"),
            value: "confirmed",
            description: t("confirmed_description"),
            icon: <ThumbUpAlt style={{ color: "#2986cc", marginRight: 20 }} />
        },
        {
            name: t("delivered"),
            value: "delivered",
            description: t("delivered_description"),
            icon: <DeliveryDining style={{ color: "#ff7600", marginRight: 20 }} />
        },
        {
            name: t("terminated"),
            value: "terminated",
            description: t("terminated_description"),
            icon: <CheckCircle style={{ color: "#6aa84f", marginRight: 20 }} />
        },
        {
            name: t("canceled"),
            value: "canceled",
            description: t("canceled_description"),
            icon: <Cancel style={{ color: "#cc0000", marginRight: 20 }} />
        },
    ]
}
