import * as React from "react"

import { useIsMobile } from "@/hooks/use-mobile"

export function useSidebar() {
    const isMobile = useIsMobile()
    const [open, setOpen] = React.useState(true)
    const [openMobile, setOpenMobile] = React.useState(false)

    function toggleSidebar() {
        if (isMobile) {
            setOpenMobile((prev) => !prev)
        } else {
            setOpen((prev) => !prev)
        }
    }

    return {
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        state: open ? "expanded" : "collapsed",
    }
}
