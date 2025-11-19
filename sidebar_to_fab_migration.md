# Migrating Sidebar to FAB on Mobile

This guide explains how to update an existing application's Sidebar to be replaced by a Floating Action Button (FAB) menu on mobile devices, using the `MobileBottomNav` component.

## 1. Strategy

The goal is to:
1.  **Hide** the Sidebar on mobile screens (e.g., `< 1024px`).
2.  **Show** the `MobileBottomNav` (FAB) on mobile screens.
3.  Ensure the main content area expands to full width on mobile.

## 2. Hiding the Sidebar

Assuming you are using a standard Sidebar component (like Shadcn UI's Sidebar), you likely have a `SidebarProvider` or a layout structure.

### Option A: CSS/Tailwind Classes (Recommended)

If your Sidebar is rendered in a layout, add `hidden lg:flex` (or `md:flex` depending on your breakpoint) to the Sidebar container.

```tsx
// layout.tsx or Sidebar wrapper
<div className="flex h-screen">
  {/* Sidebar: Hidden on mobile, visible on large screens */}
  <aside className="hidden lg:flex w-64 flex-col ...">
    {/* Sidebar content */}
  </aside>

  {/* Main Content */}
  <main className="flex-1 ...">
    {children}
  </main>
</div>
```

### Option B: Conditional Rendering (React)

If you want to avoid rendering the DOM element entirely:

```tsx
// layout.tsx
import { useMediaQuery } from '@/hooks/use-media-query'; // You might need a hook for this

export default function Layout({ children }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="flex">
      {isDesktop && <Sidebar />}
      <main className="flex-1">
        {children}
      </main>
      {/* Show FAB on mobile */}
      {!isDesktop && <MobileBottomNav />}
    </div>
  );
}
```

## 3. Integrating MobileBottomNav

Add the `MobileBottomNav` component to your layout. It is already designed to be `fixed` at the bottom, so it can be placed anywhere in the component tree, but preferably near the end of the `body` or root layout.

```tsx
// app/layout.tsx or app/dashboard/layout.tsx
import MobileBottomNav from '@/components/MobileBottomNav';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          {/* Existing Sidebar - Ensure it has 'hidden lg:flex' */}
          <Sidebar className="hidden lg:flex" />

          {/* Main Content */}
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>

        {/* FAB Navigation - Visible only on mobile (handled internally by the component's CSS) */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
```

**Note:** The `MobileBottomNav` component provided in the previous documentation already includes `lg:hidden` in its root `nav` and `div` classes:

```tsx
// components/MobileBottomNav.tsx
<nav className="... lg:hidden ...">
// ...
<div className="... lg:hidden ...">
```

This means you just need to ensure your **Sidebar** is hidden on mobile.

## 4. Adjusting Content Padding

On mobile, the FAB and Bottom Nav sit on top of the content. Ensure your content has enough bottom padding so the last items aren't obscured.

```tsx
<main className="flex-1 p-4 pb-24 lg:pb-4">
  {children}
</main>
```

- `pb-24`: Adds extra padding on mobile to account for the bottom nav.
- `lg:pb-4`: Resets padding on desktop where the nav isn't present.

## 5. Example: Shadcn UI Sidebar

If you are using the `SidebarProvider` from Shadcn UI:

```tsx
// app/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import MobileBottomNav from "@/components/MobileBottomNav"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Hide AppSidebar on mobile if it doesn't do it automatically */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      
      <main className="w-full">
        <SidebarTrigger className="hidden lg:flex" />
        {children}
      </main>

      <MobileBottomNav />
    </SidebarProvider>
  )
}
```

*Note: Shadcn UI's `Sidebar` component often handles mobile responsiveness with a Sheet/Drawer. If you want to **replace** that behavior with the FAB, you should disable the default mobile trigger and hide the Sidebar component on mobile as shown above.*
