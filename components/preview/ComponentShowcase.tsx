// Component showcase for live preview
// Displays actual components using the current design system with enhanced wrapper features

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export function ComponentShowcase() {
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <div className="space-y-8">
      {/* Typography Showcase */}
      <section>
        <h4 className="text-lg font-semibold mb-4">Typography</h4>
        <div className="space-y-4">
          <h1
            style={{
              fontSize: "var(--text-h1)",
              lineHeight: "var(--line-height-h1)",
            }}
          >
            Heading 1 - Main Title
          </h1>
          <h2
            style={{
              fontSize: "var(--text-h2)",
              lineHeight: "var(--line-height-h2)",
            }}
          >
            Heading 2 - Section Title
          </h2>
          <h3
            style={{
              fontSize: "var(--text-h3)",
              lineHeight: "var(--line-height-h3)",
            }}
          >
            Heading 3 - Subsection
          </h3>
          <p
            style={{
              fontSize: "var(--text-body)",
              lineHeight: "var(--line-height-body)",
            }}
          >
            Body text - This is how your regular content will look. It should be
            easy to read and have good contrast against the background.
          </p>
        </div>
      </section>

      {/* Button Showcase */}
      <section>
        <h4 className="text-lg font-semibold mb-4">Buttons</h4>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-medium">
              Design System Enhanced Buttons
            </h5>
            <div className="flex flex-wrap gap-4">
              <Button dsTheme="primary" variant="default">
                DS Primary
              </Button>
              <Button dsTheme="secondary" variant="default">
                DS Secondary
              </Button>
              <Button dsTheme="accent" variant="default">
                DS Accent
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-sm font-medium">Button Sizes</h5>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section>
        <h4 className="text-lg font-semibold mb-4">Form Elements</h4>
        <div className="space-y-6 max-w-md">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>

            <div>
              <label
                htmlFor="select"
                className="block text-sm font-medium mb-2"
              >
                Select Option
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-sm font-medium">Enhanced Input Variants</h5>
            <Input dsVariant="filled" placeholder="Filled input style" />
            <Input
              dsState="error"
              showValidation
              validationMessage="This field is required"
              placeholder="Error state input"
            />
            <Input
              dsState="success"
              showValidation
              validationMessage="Looks good!"
              placeholder="Success state input"
              defaultValue="valid@email.com"
            />
          </div>

          <div className="space-y-4">
            <h5 className="text-sm font-medium">Enhanced Select</h5>
            <Select>
              <SelectTrigger dsTheme="primary" dsSize="lg">
                <SelectValue placeholder="Large primary select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Enhanced Option 1</SelectItem>
                <SelectItem value="option2">Enhanced Option 2</SelectItem>
                <SelectItem value="option3">Enhanced Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h5 className="text-sm font-medium">Slider Controls</h5>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              showValue
              dsTheme="primary"
              dsSize="default"
              max={100}
              step={1}
            />
            <Slider
              defaultValue={[25, 75]}
              showValue
              dsTheme="accent"
              dsSize="lg"
              max={100}
              step={5}
            />
          </div>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h4 className="text-lg font-semibold mb-4">Cards</h4>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Example Card</CardTitle>
                <CardDescription>
                  This is how cards will look with your design system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Card content goes here. This demonstrates how your spacing,
                  typography, and colors work together.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Another Card</CardTitle>
                <CardDescription>
                  Showing consistency across multiple components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button size="sm">Action</Button>
                  <Button size="sm" variant="outline">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h5 className="text-sm font-medium">Enhanced Card Variants</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card dsTheme="primary" dsSpacing="compact" dsElevation="subtle">
                <CardHeader>
                  <CardTitle>Compact Primary</CardTitle>
                  <CardDescription>
                    Compact spacing with primary theme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Design system enhanced card with custom theming.
                  </p>
                </CardContent>
              </Card>

              <Card
                dsTheme="secondary"
                dsSpacing="comfortable"
                dsElevation="medium"
              >
                <CardHeader>
                  <CardTitle>Comfortable Secondary</CardTitle>
                  <CardDescription>
                    Medium elevation with secondary theme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Dynamic theming and elevation control.
                  </p>
                </CardContent>
              </Card>

              <Card dsTheme="neutral" dsSpacing="spacious" dsElevation="high">
                <CardHeader>
                  <CardTitle>Spacious Neutral</CardTitle>
                  <CardDescription>
                    High elevation with spacious layout
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Maximum spacing and elevation for emphasis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Components */}
      <section>
        <h4 className="text-lg font-semibold mb-4">Advanced Components</h4>
        <div className="space-y-6">
          {/* Tabs */}
          <div>
            <h5 className="text-sm font-medium mb-4">Enhanced Tabs</h5>
            <Tabs
              defaultValue="tab1"
              dsVariant="default"
              dsSpacing="comfortable"
            >
              <TabsList dsSize="default">
                <TabsTrigger value="tab1">Design System</TabsTrigger>
                <TabsTrigger value="tab2">Components</TabsTrigger>
                <TabsTrigger value="tab3">Theming</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Design System Integration</CardTitle>
                    <CardDescription>
                      These tabs are enhanced with design system theming
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      The tabs component now integrates with spacing,
                      typography, and color tokens from your design system.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab2" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Component Library</CardTitle>
                    <CardDescription>
                      All components work together harmoniously
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Each wrapper component maintains full ShadCN compatibility
                      while adding design system enhancements.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tab3" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Dynamic Theming</CardTitle>
                    <CardDescription>
                      Real-time updates across all components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Changes to your design tokens are immediately reflected in
                      all enhanced components.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Dialog and Tooltip */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium">Interactive Components</h5>
            <div className="flex flex-wrap gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Enhanced Dialog</Button>
                </DialogTrigger>
                <DialogContent dsSize="default" dsSpacing="comfortable">
                  <DialogHeader>
                    <DialogTitle>Design System Enhanced Dialog</DialogTitle>
                    <DialogDescription>
                      This dialog integrates with your design system tokens for
                      consistent spacing, typography, and theming.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Enhanced input in dialog" />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                      <Button size="sm">Save Changes</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Primary Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent dsTheme="primary" dsSize="default">
                  This tooltip uses the primary theme from your design system
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Neutral Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent dsTheme="neutral" dsSize="lg">
                  This is a larger neutral-themed tooltip with border
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      {/* Color Swatches */}
      <section>
        <h4 className="text-lg font-semibold mb-4">Color System</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div
              className="w-full h-16 rounded mb-2"
              style={{ backgroundColor: "var(--primary-color)" }}
            />
            <span className="text-xs">Primary</span>
          </div>
          <div className="text-center">
            <div
              className="w-full h-16 rounded mb-2"
              style={{ backgroundColor: "var(--secondary-color)" }}
            />
            <span className="text-xs">Secondary</span>
          </div>
          <div className="text-center">
            <div
              className="w-full h-16 rounded mb-2"
              style={{ backgroundColor: "var(--accent-color)" }}
            />
            <span className="text-xs">Accent</span>
          </div>
          <div className="text-center">
            <div
              className="w-full h-16 rounded border mb-2"
              style={{ backgroundColor: "var(--background-color)" }}
            />
            <span className="text-xs">Background</span>
          </div>
          <div className="text-center">
            <div
              className="w-full h-16 rounded border mb-2"
              style={{ backgroundColor: "var(--text-color)" }}
            />
            <span className="text-xs">Text</span>
          </div>
        </div>
      </section>

      {/* Design System Features Demo */}
      <section>
        <h4 className="text-lg font-semibold mb-4">Design System Features</h4>
        <Card dsSpacing="spacious">
          <CardHeader>
            <CardTitle>Enhanced Component Features</CardTitle>
            <CardDescription>
              All wrapper components now support design system integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h6 className="font-medium mb-2">Dynamic Theming</h6>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Real-time color token updates</li>
                  <li>Theme-aware component variants</li>
                  <li>Consistent cross-component styling</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium mb-2">Enhanced Functionality</h6>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Validation states for inputs</li>
                  <li>Custom spacing and elevation</li>
                  <li>Responsive design token application</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium mb-2">Developer Experience</h6>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Full ShadCN API compatibility</li>
                  <li>Optional design system props</li>
                  <li>TypeScript support throughout</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium mb-2">Performance</h6>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Minimal overhead wrapper pattern</li>
                  <li>Optimized re-renders with Jotai</li>
                  <li>CSS custom properties for styling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
