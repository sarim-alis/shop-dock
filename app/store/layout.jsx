import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "ShopDock. - Store Dashboard",
    description: "ShopDock. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
