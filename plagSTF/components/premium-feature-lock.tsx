"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { PremiumUpgradeModal } from "./premium-upgrade-modal"
import { premiumFeatures, isFeatureAvailable, getUserPlan } from "@/lib/premium-features"

interface PremiumFeatureLockProps {
  featureKey: string
  children: React.ReactNode
  className?: string
}

export function PremiumFeatureLock({ featureKey, children, className }: PremiumFeatureLockProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const userPlan = getUserPlan()
  const isAvailable = isFeatureAvailable(featureKey, userPlan)

  // Extract feature name and description
  const [category, feature] = featureKey.split(".")
  const featureInfo =
    category && feature
      ? premiumFeatures[category as keyof typeof premiumFeatures]?.[feature as any]
      : { name: "Premium Feature", description: "This feature requires a premium plan" }

  if (isAvailable) {
    return <>{children}</>
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-black/5 dark:bg-black/20 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center rounded-lg">
        <div className="bg-background/95 p-4 rounded-lg shadow-lg max-w-xs text-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium mb-1">{featureInfo.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{featureInfo.description}</p>
          <Button size="sm" onClick={() => setShowUpgradeModal(true)}>
            Upgrade to Premium
          </Button>
        </div>
      </div>

      <div className="opacity-50 pointer-events-none">{children}</div>

      <PremiumUpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        requiredFeature={featureInfo.name}
      />
    </div>
  )
}
