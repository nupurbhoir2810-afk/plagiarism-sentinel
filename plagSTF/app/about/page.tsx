import { Card, CardContent } from "@/components/ui/card"
import { Zap, Shield, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="text-center mb-12 animate-fade-down">
        <h1 className="text-4xl font-bold mb-4">About PlagSentiNEL</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Leading the way in AI-powered content analysis and creation
        </p>
      </div>

      <div className="space-y-12">
        <section className="space-y-4 animate-fade-up">
          <h2 className="text-2xl font-bold text-center">Our Mission</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            At PlagSentiNEL, we're committed to maintaining academic and creative integrity through cutting-edge AI
            technology. Our suite of tools helps writers, educators, and content creators ensure originality and improve
            their work.
          </p>
        </section>

        <div className="grid md:grid-cols-3 gap-6 animate-fade-up">
          <Card className="hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Zap className="h-12 w-12 text-primary" />
                <h3 className="font-bold">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Leveraging cutting-edge AI technology to provide accurate content analysis
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Shield className="h-12 w-12 text-primary" />
                <h3 className="font-bold">Integrity</h3>
                <p className="text-sm text-muted-foreground">Maintaining academic honesty and creative authenticity</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Globe className="h-12 w-12 text-primary" />
                <h3 className="font-bold">Global Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Serving users worldwide with reliable content verification
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4 animate-fade-up">
          <h2 className="text-2xl font-bold text-center">Our Technology</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            We leverage advanced AI and machine learning algorithms to provide accurate content analysis. Our technology
            processes millions of documents daily, ensuring reliable results for our users.
          </p>
        </section>

        <div className="grid md:grid-cols-3 gap-6 animate-fade-up">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10M+</div>
            <p className="text-sm text-muted-foreground">Documents processed daily</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
            <p className="text-sm text-muted-foreground">Accuracy rate</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <p className="text-sm text-muted-foreground">Customer support</p>
          </div>
        </div>
      </div>
    </div>
  )
}
