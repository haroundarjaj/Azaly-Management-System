import { SaveAs, ThumbUpAlt, DeliveryDining, CheckCircle, Cancel } from '@mui/icons-material';

export default function GenerateOrderStates(t) {
    return [
        {
            name: t("registered"),
            value: "registered",
            dateName: "registeredDate",
            description: t("registered_description"),
            icon: <SaveAs style={{ color: "#cecece", marginRight: 20 }} />,
            color: "#cecece"
        },
        {
            name: t("confirmed"),
            value: "confirmed",
            dateName: "confirmedDate",
            description: t("confirmed_description"),
            icon: <ThumbUpAlt style={{ color: "#2986cc", marginRight: 20 }} />,
            color: "#2986cc"
        },
        {
            name: t("shipped"),
            value: "shipped",
            dateName: "ShippedDate",
            description: t("shipped_description"),
            icon: <CheckCircle style={{ color: "#6aa84f", marginRight: 20 }} />,
            color: "#6aa84f"
        },
        {
            name: t("delivered"),
            value: "delivered",
            dateName: "deliveredDate",
            description: t("delivered_description"),
            icon: <DeliveryDining style={{ color: "#ff7600", marginRight: 20 }} />,
            color: "#ff7600"
        },
        {
            name: t("canceled"),
            value: "canceled",
            dateName: "canceledDate",
            description: t("canceled_description"),
            icon: <Cancel style={{ color: "#cc0000", marginRight: 20 }} />,
            color: "#cc0000"
        },
    ]
}
