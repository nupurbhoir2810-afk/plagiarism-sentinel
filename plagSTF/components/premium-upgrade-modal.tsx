"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, CreditCard, Smartphone, AlertTriangle, Unlock } from "lucide-react"
import { pricingPlans } from "@/lib/premium-features"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

interface PremiumUpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (plan: string) => void
  requiredFeature?: string
}

export function PremiumUpgradeModal({ open, onOpenChange, onSuccess, requiredFeature }: PremiumUpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(pricingPlans[1].id)
  const [paymentStep, setPaymentStep] = useState<"plan" | "payment" | "confirmation">("plan")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card")
  const [isProcessing, setIsProcessing] = useState(false)

  // Card payment details
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })

  // UPI payment details
  const [upiId, setUpiId] = useState("")

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handlePaymentMethodChange = (value: "card" | "upi") => {
    setPaymentMethod(value)
  }

  const handleCardDetailsChange = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpiChange = (value: string) => {
    setUpiId(value)
  }

  const handleContinueToPayment = () => {
    setPaymentStep("payment")
  }

  const handleBackToPlan = () => {
    setPaymentStep("plan")
  }

  const handleProcessPayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate successful payment
    setIsProcessing(false)
    setPaymentStep("confirmation")

    // Save user plan to localStorage
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      user.plan = selectedPlan
      user.isPremium = true

      // Set expiry date to 30 days from now
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 30)
      user.premiumExpiry = expiryDate.toISOString()

      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      console.error("Error saving user plan:", error)
    }
  }

  const handleFinish = () => {
    onOpenChange(false)
    if (onSuccess) {
      onSuccess(selectedPlan)
    }
    toast.success(`Successfully upgraded to ${pricingPlans.find((p) => p.id === selectedPlan)?.name} plan!`)

    // Reset state for next time
    setPaymentStep("plan")
    setIsProcessing(false)
  }

  const selectedPlanDetails = pricingPlans.find((plan) => plan.id === selectedPlan)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {paymentStep === "plan" && (
          <>
            <DialogHeader>
              <DialogTitle>Upgrade to Premium</DialogTitle>
              <DialogDescription>
                {requiredFeature ? (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span>This feature requires a premium plan</span>
                  </div>
                ) : (
                  "Choose a plan that works for you"
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pricingPlans
                  .filter((plan) => plan.id !== "basic")
                  .map((plan) => (
                    <Card
                      key={plan.id}
                      className={`relative cursor-pointer transition-all ${
                        selectedPlan === plan.id ? "border-primary shadow-md" : "hover:border-primary/50"
                      }`}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {plan.id === "premium" && (
                        <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-pink-600">
                          Popular
                        </Badge>
                      )}
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>
                          <div className="flex items-baseline mt-2">
                            <span className="text-3xl font-bold">${plan.price}</span>
                            <span className="text-sm text-muted-foreground ml-1">/{plan.billing}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Features</h4>
                          <ul className="space-y-2">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-start">
                                <Check className="h-4 w-4 text-green-500 mr-2 mt-1 shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {plan.limitations.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Limitations</h4>
                            <ul className="space-y-2">
                              {plan.limitations.map((limitation, i) => (
                                <li key={i} className="flex items-start">
                                  <X className="h-4 w-4 text-red-500 mr-2 mt-1 shrink-0" />
                                  <span className="text-sm">{limitation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <div className="w-full flex justify-center">
                          {selectedPlan === plan.id ? (
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground">
                              <Check className="h-5 w-5" />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full border-2 border-muted" />
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleContinueToPayment}>Continue to Payment</Button>
            </DialogFooter>
          </>
        )}

        {paymentStep === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>
                Complete your payment to upgrade to the {selectedPlanDetails?.name} plan
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Order Summary</h3>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span>{selectedPlanDetails?.name} Plan</span>
                    <span>
                      ${selectedPlanDetails?.price}/{selectedPlanDetails?.billing}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>${selectedPlanDetails?.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Tabs defaultValue="card" onValueChange={(v) => handlePaymentMethodChange(v as "card" | "upi")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit/Debit Card
                    </TabsTrigger>
                    <TabsTrigger value="upi" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      UPI
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => handleCardDetailsChange("number", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => handleCardDetailsChange("name", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => handleCardDetailsChange("expiry", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardDetailsChange("cvv", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="upi" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => handleUpiChange(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter your UPI ID (e.g., name@okaxis, phone@paytm)
                      </p>
                    </div>

                    <div className="mt-4">
                      <Label className="mb-2 block">Select UPI App</Label>
                      <RadioGroup defaultValue="gpay" className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center space-y-1">
                          <RadioGroupItem value="gpay" id="gpay" className="sr-only" />
                          <Label
                            htmlFor="gpay"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <span className="text-sm font-medium">Google Pay</span>
                          </Label>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <RadioGroupItem value="phonepe" id="phonepe" className="sr-only" />
                          <Label
                            htmlFor="phonepe"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <span className="text-sm font-medium">PhonePe</span>
                          </Label>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <RadioGroupItem value="paytm" id="paytm" className="sr-only" />
                          <Label
                            htmlFor="paytm"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <span className="text-sm font-medium">Paytm</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleBackToPlan}>
                Back
              </Button>
              <Button onClick={handleProcessPayment} disabled={isProcessing} className="relative">
                {isProcessing ? "Processing..." : "Complete Payment"}
                {isProcessing && (
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {paymentStep === "confirmation" && (
          <>
            <DialogHeader>
              <DialogTitle>Payment Successful!</DialogTitle>
              <DialogDescription>
                Your account has been upgraded to the {selectedPlanDetails?.name} plan
              </DialogDescription>
            </DialogHeader>

            <div className="py-8 flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>

              <h3 className="text-xl font-bold mb-2">Thank You for Your Purchase</h3>
              <p className="text-center text-muted-foreground mb-4">
                Your premium features are now unlocked and ready to use
              </p>

              <div className="bg-muted p-4 rounded-md w-full max-w-sm mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="font-medium">{selectedPlanDetails?.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-medium">${selectedPlanDetails?.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{paymentMethod === "card" ? "Credit/Debit Card" : "UPI"}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Transaction ID</span>
                  <span className="font-medium">TXN{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Unlock className="h-4 w-4" />
                <span>All premium features are now unlocked</span>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleFinish}>Continue to Dashboard</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
