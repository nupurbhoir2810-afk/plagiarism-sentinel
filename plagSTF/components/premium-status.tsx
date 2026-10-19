"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, AlertTriangle } from "lucide-react"
import { PremiumUpgradeModal } from "./premium-upgrade-modal"
import { getUserPlan } from "@/lib/premium-features"
import { getPremiumStatus } from "@/lib/config"

export function PremiumStatus() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [userPlan, setUserPlan] = useState("basic")
  const [premiumStatus, setPremiumStatus] = useState<ReturnType<typeof getPremiumStatus>>(null)

  useEffect(() => {
    setUserPlan(getUserPlan())
    setPremiumStatus(getPremiumStatus())

    // Set up interval to check premium status every minute
    const interval = setInterval(() => {
      setPremiumStatus(getPremiumStatus())
      setUserPlan(getUserPlan())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case "standard":
        return "Standard"
      case "premium":
        return "Premium"
      case "enterprise":
        return "Enterprise"
      default:
        return "Free"
    }
  }

  if (userPlan === "basic") {
    return (
      <div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowUpgradeModal(true)}>
          <Crown className="h-4 w-4 text-amber-500" />
          <span>Upgrade</span>
        </Button>

        <PremiumUpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {premiumStatus && premiumStatus.daysLeft < 5 && (
        <div className="hidden md:flex items-center gap-1.5 text-xs text-amber-500">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>{premiumStatus.daysLeft} days left</span>
        </div>
      )}

      <Badge
        variant="outline"
        className="gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
      >
        <Crown className="h-3.5 w-3.5 text-amber-500" />
        <span>{getPlanLabel(userPlan)}</span>
      </Badge>

      <PremiumUpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </div>
  )
}
