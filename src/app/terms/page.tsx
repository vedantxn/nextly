"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

export default function TermsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>("");
  const { theme, setTheme } = useTheme();

  const sections = [
    { id: "acceptance", title: "Acceptance of Terms" },
    { id: "description", title: "Service Description" },
    { id: "registration", title: "User Registration" },
    { id: "usage", title: "Acceptable Use" },
    { id: "ai-services", title: "AI-Generated Content" },
    { id: "intellectual-property", title: "Intellectual Property" },
    { id: "user-content", title: "User-Generated Content" },
    { id: "privacy", title: "Privacy and Data" },
    { id: "payments", title: "Payments and Billing" },
    { id: "termination", title: "Account Termination" },
    { id: "disclaimers", title: "Disclaimers" },
    { id: "limitation", title: "Limitation of Liability" },
    { id: "indemnification", title: "Indemnification" },
    { id: "modifications", title: "Modifications to Terms" },
    { id: "governing-law", title: "Governing Law" },
    { id: "contact", title: "Contact Information" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
  <div className="flex items-center gap-6">
    <button
      onClick={() => router.back()}
      className="group relative text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      ← Back
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300 ease-out"></span>
    </button>
    
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Terms of Service</h1>
    </div>
  </div>

  <div className="flex items-center gap-6">
    <button
      onClick={() => router.push("/privacy")}
      className="group relative text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      Privacy Policy →
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300 ease-out"></span>
    </button>
    
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="group relative text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300 ease-out"></span>
    </button>
  </div>
</div>


        <div className="flex gap-12">
          {/* Table of Contents - Sticky Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8 bg-background border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`block text-sm py-2 px-3 rounded-lg transition-all duration-200 hover:bg-muted hover:text-primary ${
                      activeSection === section.id ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <span className="text-xs font-mono text-muted-foreground mr-2">
                      {(index + 1).toString().padStart(2, '0')}.
                    </span>
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <div className="bg-background border border-border rounded-2xl shadow-lg p-12 prose prose-gray dark:prose-invert max-w-none">
              
              {/* Introduction */}
              <div className="mb-12 p-6 bg-primary/5 border border-primary/20 rounded-xl">
                <h2 className="text-xl font-semibold text-foreground mb-3">Welcome to Nextly</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service ("Terms") govern your use of Nextly, an AI-powered platform for generating Next.js applications. 
                  By accessing or using our service, you agree to be bound by these Terms.
                </p>
              </div>

              {/* Section 1 */}
              <section id="acceptance" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  1. Acceptance of Terms
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    By creating an account, accessing, or using Nextly's services, you acknowledge that you have read, 
                    understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not 
                    agree to these terms, you may not use our services.
                  </p>
                  <p>
                    These Terms constitute a legally binding agreement between you ("User" or "you") and Nextly 
                    ("we," "us," or "our"). Your use of the service indicates your acceptance of these Terms, 
                    regardless of whether you have created an account.
                  </p>
                  <p>
                    We reserve the right to update these Terms at any time. Changes will be effective immediately 
                    upon posting. Your continued use of the service after changes are posted constitutes acceptance 
                    of the revised Terms.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="description" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  2. Service Description
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Nextly is an artificial intelligence-powered platform that enables users to generate Next.js 
                    applications through natural language prompts. Our service provides:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>AI-assisted code generation for Next.js applications</li>
                    <li>Project management and organization tools</li>
                    <li>Code editing and modification capabilities</li>
                    <li>Export and deployment assistance</li>
                    <li>Collaboration features for team projects</li>
                  </ul>
                  <p>
                    The service uses advanced machine learning models to interpret user requirements and generate 
                    corresponding code. While we strive for accuracy, AI-generated content may contain errors or 
                    may not perfectly match user expectations.
                  </p>
                  <p>
                    We reserve the right to modify, suspend, or discontinue any aspect of the service at any time, 
                    with or without notice. We may also impose limits on certain features or restrict access to 
                    parts of the service.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section id="registration" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  3. User Registration and Account Security
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    To access certain features of Nextly, you must create an account. During registration, you agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security and confidentiality of your account credentials</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>
                  <p>
                    You must be at least 18 years old to create an account. If you are under 18, you may only use 
                    the service with parental or guardian consent and supervision.
                  </p>
                  <p>
                    We reserve the right to refuse registration, suspend, or terminate accounts that violate these 
                    Terms or engage in prohibited activities. Account names and usernames must be appropriate and 
                    may not infringe on intellectual property rights or be offensive.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section id="usage" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  4. Acceptable Use Policy
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    You agree to use Nextly only for lawful purposes and in accordance with these Terms. 
                    Prohibited uses include, but are not limited to:
                  </p>
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 rounded-xl">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Prohibited Activities:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-red-600 dark:text-red-300">
                      <li>Generating malicious code, malware, or security exploits</li>
                      <li>Creating applications that violate laws or regulations</li>
                      <li>Reverse engineering or attempting to extract our AI models</li>
                      <li>Automated scraping or data harvesting</li>
                      <li>Sharing account credentials with unauthorized parties</li>
                      <li>Circumventing usage limits or security measures</li>
                      <li>Generating spam, phishing, or fraudulent content</li>
                      <li>Violating intellectual property rights</li>
                    </ul>
                  </div>
                  <p>
                    We monitor usage patterns to ensure compliance with these Terms. Violations may result in 
                    immediate account suspension or termination without prior notice.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section id="ai-services" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  5. AI-Generated Content and Limitations
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Nextly's AI service generates code based on your prompts and requirements. Important considerations 
                    regarding AI-generated content:
                  </p>
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">AI Content Disclaimer:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-amber-600 dark:text-amber-300">
                      <li>Generated code may contain errors, bugs, or security vulnerabilities</li>
                      <li>AI responses are not guaranteed to be accurate or complete</li>
                      <li>Code may not follow all best practices or optimization techniques</li>
                      <li>Results may vary based on prompt complexity and clarity</li>
                      <li>Generated content should be reviewed and tested before production use</li>
                    </ul>
                  </div>
                  <p>
                    You are solely responsible for reviewing, testing, and validating all AI-generated code before 
                    deployment. We recommend thorough security audits for production applications.
                  </p>
                  <p>
                    Our AI models are trained on publicly available code and documentation. While we strive to 
                    generate original code, there may be similarities to existing codebases. You are responsible 
                    for ensuring your use complies with applicable licenses and copyrights.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section id="intellectual-property" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  6. Intellectual Property Rights
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    The Nextly platform, including its AI models, algorithms, user interface, and underlying 
                    technology, is protected by intellectual property laws and remains our exclusive property.
                  </p>
                  <h4 className="font-semibold text-foreground">Our Rights:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All rights in the Nextly platform and technology</li>
                    <li>Trademarks, logos, and brand elements</li>
                    <li>Proprietary AI models and training methodologies</li>
                    <li>Platform design and user experience elements</li>
                  </ul>
                  <h4 className="font-semibold text-foreground">Your Rights:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Ownership of code generated specifically for your projects</li>
                    <li>Right to use, modify, and distribute your generated code</li>
                    <li>Intellectual property in your original prompts and specifications</li>
                    <li>Data and content you upload to the platform</li>
                  </ul>
                  <p>
                    We grant you a limited, non-exclusive, non-transferable license to use the platform during 
                    your subscription period, subject to these Terms.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="user-content" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  7. User-Generated Content and Data
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    You retain ownership of all original content, prompts, and data you provide to Nextly. 
                    However, you grant us certain rights to provide and improve our services:
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">License Grant:</h4>
                    <p className="text-blue-600 dark:text-blue-300">
                      You grant Nextly a worldwide, non-exclusive, royalty-free license to use, process, 
                      and analyze your content solely for the purpose of providing services, improving our AI models, 
                      and developing new features.
                    </p>
                  </div>
                  <p>
                    We may use aggregated, anonymized data derived from user interactions to improve our services. 
                    This does not include personally identifiable information or proprietary business data.
                  </p>
                  <p>
                    You are responsible for ensuring you have all necessary rights to content you upload. 
                    You must not upload copyrighted material, trade secrets, or confidential information without 
                    proper authorization.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section id="privacy" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  8. Privacy and Data Protection
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Your privacy is important to us. Our collection, use, and protection of your personal 
                    information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                  </p>
                  <h4 className="font-semibold text-foreground">Data Security:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Industry-standard encryption for data transmission and storage</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Secure backup and disaster recovery procedures</li>
                  </ul>
                  <p>
                    While we implement robust security measures, no system is completely secure. You acknowledge 
                    that you provide information at your own risk.
                  </p>
                  <p>
                    For users in the European Union, we comply with GDPR requirements. You have rights regarding 
                    your personal data, including access, rectification, erasure, and portability.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section id="payments" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  9. Payments, Billing, and Subscriptions
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Nextly offers both free and premium subscription tiers. Premium features require a paid subscription 
                    with the following terms:
                  </p>
                  <h4 className="font-semibold text-foreground">Billing Terms:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                    <li>All fees are non-refundable except as required by law</li>
                    <li>Prices may change with 30 days advance written notice</li>
                    <li>Failed payments may result in service suspension</li>
                    <li>You authorize us to charge your payment method automatically</li>
                  </ul>
                  <h4 className="font-semibold text-foreground">Cancellation:</h4>
                  <p>
                    You may cancel your subscription at any time through your account settings. Cancellation 
                    takes effect at the end of your current billing period. You retain access to premium 
                    features until that time.
                  </p>
                  <p>
                    We reserve the right to suspend or terminate accounts with overdue payments. Upon termination, 
                    you may lose access to premium features and stored data.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section id="termination" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  10. Account Termination
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Either party may terminate this agreement at any time. Termination may occur under the 
                    following circumstances:
                  </p>
                  <h4 className="font-semibold text-foreground">Termination by You:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You may delete your account at any time through account settings</li>
                    <li>Cancellation requests are processed within 24 hours</li>
                    <li>You remain responsible for charges incurred before termination</li>
                  </ul>
                  <h4 className="font-semibold text-foreground">Termination by Us:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violation of these Terms of Service</li>
                    <li>Fraudulent or illegal activities</li>
                    <li>Abuse of service or resources</li>
                    <li>Non-payment of fees</li>
                    <li>At our discretion with reasonable notice</li>
                  </ul>
                  <p>
                    Upon termination, your access to the service will cease immediately. We may delete your 
                    account data after a reasonable period, though we may retain certain information as required 
                    by law or for legitimate business purposes.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section id="disclaimers" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  11. Disclaimers and Warranties
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-4 rounded-xl">
                    <p className="font-semibold text-foreground mb-2">IMPORTANT DISCLAIMER:</p>
                    <p className="text-sm">
                      THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                      WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, 
                      FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                  </div>
                  <p>
                    We do not warrant that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>The service will be uninterrupted or error-free</li>
                    <li>AI-generated code will be bug-free or secure</li>
                    <li>Generated applications will meet your specific requirements</li>
                    <li>Data transmission will be secure or private</li>
                    <li>Third-party integrations will function correctly</li>
                  </ul>
                  <p>
                    Some jurisdictions do not allow the exclusion of implied warranties, so some of the above 
                    exclusions may not apply to you. In such cases, our liability is limited to the maximum 
                    extent permitted by law.
                  </p>
                </div>
              </section>

              {/* Section 12 */}
              <section id="limitation" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  12. Limitation of Liability
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 rounded-xl">
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-2">LIABILITY LIMITATION:</p>
                    <p className="text-red-600 dark:text-red-300 text-sm">
                      IN NO EVENT SHALL NEXTLY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
                      OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, 
                      OR OTHER INTANGIBLE LOSSES.
                    </p>
                  </div>
                  <p>
                    Our total liability to you for all claims arising from your use of the service shall not 
                    exceed the amount you paid us in the twelve (12) months preceding the claim, or $100, 
                    whichever is greater.
                  </p>
                  <p>
                    This limitation applies regardless of the legal theory on which the claim is based, whether 
                    in contract, tort, negligence, strict liability, or otherwise, and whether or not we have 
                    been advised of the possibility of such damages.
                  </p>
                  <p>
                    Some jurisdictions do not allow the limitation or exclusion of liability for incidental or 
                    consequential damages. In such jurisdictions, our liability is limited to the maximum extent 
                    permitted by law.
                  </p>
                </div>
              </section>

              {/* Section 13 */}
              <section id="indemnification" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  13. Indemnification
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    You agree to indemnify, defend, and hold harmless Nextly, its officers, directors, employees, 
                    agents, and affiliates from and against any and all claims, damages, obligations, losses, 
                    liabilities, costs, and expenses arising from:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your use or misuse of the service</li>
                    <li>Violation of these Terms or applicable laws</li>
                    <li>Infringement of third-party intellectual property rights</li>
                    <li>Your user content or generated applications</li>
                    <li>Disputes with other users or third parties</li>
                  </ul>
                  <p>
                    This indemnification obligation survives termination of your account and these Terms. 
                    We reserve the right to assume exclusive defense and control of any matter subject to 
                    indemnification by you.
                  </p>
                </div>
              </section>

              {/* Section 14 */}
              <section id="modifications" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  14. Modifications to Terms and Service
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We reserve the right to modify these Terms at any time. Changes will be effective immediately 
                    upon posting to our website. We will notify users of material changes through:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Email notification to registered users</li>
                    <li>In-app notifications or announcements</li>
                    <li>Updates to our website and documentation</li>
                  </ul>
                  <p>
                    Your continued use of the service after changes are posted constitutes acceptance of the 
                    revised Terms. If you do not agree to the changes, you must stop using the service and 
                    may terminate your account.
                  </p>
                  <p>
                    We may also modify, suspend, or discontinue any aspect of the service at any time, including 
                    features, functionality, or availability. We are not liable for any modification, suspension, 
                    or discontinuation of the service.
                  </p>
                </div>
              </section>

              {/* Section 15 */}
              <section id="governing-law" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  15. Governing Law and Dispute Resolution
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction], 
                    without regard to its conflict of law provisions. Any disputes arising from these Terms or 
                    your use of the service shall be resolved through:
                  </p>
                  <h4 className="font-semibold text-foreground">Dispute Resolution Process:</h4>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li><strong>Informal Resolution:</strong> Contact our support team to resolve disputes amicably</li>
                    <li><strong>Mediation:</strong> If informal resolution fails, disputes may be submitted to mediation</li>
                    <li><strong>Arbitration:</strong> Final disputes shall be resolved through binding arbitration</li>
                  </ol>
                  <p>
                    You agree to resolve disputes individually and waive any right to participate in class action 
                    lawsuits or class-wide arbitrations. The arbitration shall be conducted by a neutral arbitrator 
                    in accordance with established arbitration rules.
                  </p>
                  <p>
                    Notwithstanding the above, either party may seek injunctive relief in court to prevent 
                    irreparable harm or protect intellectual property rights.
                  </p>
                </div>
              </section>

              {/* Section 16 */}
              <section id="contact" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                  16. Contact Information
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    If you have any questions about these Terms or need to contact us regarding legal matters, 
                    please reach out through the following channels:
                  </p>
                  <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-3">Contact Details:</h4>
                    <div className="space-y-2">
                      <p><strong>Email:</strong> legal@nextly.live</p>
                      <p><strong>Support:</strong> vedant@nextly.live</p>
                      <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM UTC</p>
                      <p><strong>Response Time:</strong> We typically respond within 48 hours</p>
                    </div>
                  </div>
                  <p>
                    For urgent legal matters or abuse reports, please use the priority contact methods indicated 
                    in your user dashboard or mark your communication as "URGENT - LEGAL MATTER."
                  </p>
                </div>
              </section>

              {/* Footer */}
              <div className="mt-16 pt-8 border-t border-border text-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Last updated: January 27, 2025</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  These Terms of Service are effective as of the date listed above and replace all previous versions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
