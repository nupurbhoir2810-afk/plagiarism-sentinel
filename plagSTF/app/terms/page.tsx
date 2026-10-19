export default function Terms() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using PlagSentiNEL's services, you agree to be bound by these Terms of Service and all
              applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>PlagSentiNEL provides AI-powered content analysis tools, including but not limited to:</p>
            <ul>
              <li>Plagiarism detection</li>
              <li>Music similarity analysis</li>
              <li>Text editing and formatting</li>
              <li>Content generation and paraphrasing</li>
            </ul>
          </section>

          <section>
            <h2>3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate information</li>
              <li>Maintain the security of your account</li>
              <li>Use the services legally and responsibly</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2>4. Subscription and Payments</h2>
            <p>
              Premium features require a paid subscription. Payments are processed securely through our payment
              providers. Subscriptions automatically renew unless cancelled.
            </p>
          </section>

          <section>
            <h2>5. Intellectual Property</h2>
            <p>
              All content and services provided by PlagSentiNEL are protected by copyright and other intellectual
              property laws. You may not copy, modify, or distribute our content without permission.
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              PlagSentiNEL provides its services "as is" and makes no warranties, express or implied. We are not liable
              for any damages arising from the use of our services.
            </p>
          </section>

          <section>
            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of our services constitutes
              acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2>8. Contact Information</h2>
            <p>For questions about these Terms, please contact us at:</p>
            <p>
              Email: legal@plagsentinel.com
              <br />
              Address: 123 Tech Street, Innovation City, 12345
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
