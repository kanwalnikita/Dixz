"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DebugRouter = () => {
    const router = useRouter();

    useEffect(() => {
        console.log("🚀 Current Path:", window.location.pathname);
    }, []);

    return null;
};

export default DebugRouter;