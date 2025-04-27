"use client"

import { isAdminWithRedirect } from "@/components";

export default function Accounts() {
    isAdminWithRedirect();
    return <>Accounts</>;
}