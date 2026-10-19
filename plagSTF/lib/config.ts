export const config = {
  api: {
    key: process.env.NEXT_PUBLIC_API_KEY,
    url: process.env.NEXT_PUBLIC_API_URL || "https://api.plagsentinel.com",
  },
  storage: {
    type: process.env.NEXT_PUBLIC_STORAGE_TYPE || "local",
    endpoint: process.env.NEXT_PUBLIC_STORAGE_ENDPOINT,
  },
}

export const isUserPremium = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.isPremium) return false

    // Check if premium has expired
    if (user.premiumExpiry) {
      const expiryDate = new Date(user.premiumExpiry)
      if (expiryDate < new Date()) {
        // Premium has expired, update user data
        localStorage.setItem("user", JSON.stringify({ ...user, isPremium: false }))
        return false
      }
    }

    return true
  } catch {
    return false
  }
}

export const checkAccess = () => true

export const getPremiumStatus = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.isPremium) return null

    if (user.premiumExpiry) {
      const expiryDate = new Date(user.premiumExpiry)
      const now = new Date()

      if (expiryDate < now) {
        return null
      }

      const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return {
        active: true,
        expiryDate,
        daysLeft,
      }
    }

    return null
  } catch {
    return null
  }
}
