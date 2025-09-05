// Site footer component
// Following the blueprint component architecture

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">hueJitsu</h3>
            <p className="text-sm text-foreground/60">
              Design system builder for developers
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <div className="space-y-2 text-sm">
              <div>
                <a
                  href="/features"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Features
                </a>
              </div>
              <div>
                <a
                  href="/pricing"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Pricing
                </a>
              </div>
              <div>
                <a
                  href="/docs"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Documentation
                </a>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <div className="space-y-2 text-sm">
              <div>
                <a
                  href="/help"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Help Center
                </a>
              </div>
              <div>
                <a
                  href="/contact"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <div className="space-y-2 text-sm">
              <div>
                <a
                  href="/privacy"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Privacy
                </a>
              </div>
              <div>
                <a
                  href="/terms"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-foreground/60">
          © 2024 hueJitsu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
