"use client"

import { isAdminWithRedirect } from "@/components";

export default function DataSource() {
    isAdminWithRedirect();
    return <>DataSource</>;
}