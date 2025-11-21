# Mobile Responsive Layouts Guide

## Breakpoint System

```css
/* Tailwind Default Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

## Page Layout Patterns

### Basic Responsive Container

```typescript
<main className="min-h-screen pb-20 lg:pb-0">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {children}
  </div>
</main>
```

### Full-Width Mobile, Contained Desktop

```typescript
<div className="px-0 sm:px-4 lg:container lg:mx-auto lg:px-8">
  {content}
</div>
```

## Common Page Layouts

### Hero Section

```typescript
<section className="relative h-[60vh] sm:h-[70vh] lg:h-screen">
  {/* Background */}
  <div className="absolute inset-0">
    <Image
      src="/hero.jpg"
      alt="Hero"
      fill
      className="object-cover"
      priority
    />
  </div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
      Title
    </h1>
    <p className="mt-4 text-base sm:text-lg lg:text-xl max-w-xs sm:max-w-md lg:max-w-2xl">
      Description text
    </p>
  </div>
</section>
```

### Grid Layouts

```typescript
{/* 1 col mobile → 2 col tablet → 3 col desktop → 4 col large */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>

{/* 1 col mobile → 2 col tablet → 3 col desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>

{/* 2 col mobile → 3 col tablet → 4 col desktop */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Sidebar Layout

```typescript
<div className="flex flex-col lg:flex-row min-h-screen">
  {/* Sidebar - Hidden on mobile, shown on desktop */}
  <aside className="hidden lg:block w-64 shrink-0 border-r">
    <Sidebar />
  </aside>

  {/* Main content */}
  <main className="flex-1 pb-20 lg:pb-0">
    {children}
  </main>

  {/* Mobile nav - shown on mobile only */}
  <MobileBottomNav />
</div>
```

### Two-Column Content

```typescript
<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
  {/* Main content - full width mobile, 2/3 desktop */}
  <div className="w-full lg:w-2/3">
    <MainContent />
  </div>

  {/* Sidebar - full width mobile, 1/3 desktop */}
  <div className="w-full lg:w-1/3">
    <SidebarContent />
  </div>
</div>
```

## Component Patterns

### Card Component

```typescript
<div className="bg-white rounded-lg shadow-md overflow-hidden">
  {/* Image - aspect ratio maintained */}
  <div className="relative aspect-video sm:aspect-[4/3]">
    <Image src={image} alt={title} fill className="object-cover" />
  </div>

  {/* Content */}
  <div className="p-3 sm:p-4 lg:p-6">
    <h3 className="text-base sm:text-lg lg:text-xl font-semibold line-clamp-2">
      {title}
    </h3>
    <p className="mt-2 text-sm sm:text-base text-gray-600 line-clamp-2 sm:line-clamp-3">
      {description}
    </p>
  </div>
</div>
```

### Profile/Avatar Card

```typescript
<div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
  {/* Avatar */}
  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shrink-0">
    <Image src={avatar} alt={name} width={128} height={128} className="object-cover" />
  </div>

  {/* Info */}
  <div className="text-center sm:text-left">
    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{name}</h2>
    <p className="text-sm sm:text-base text-gray-600">{role}</p>
  </div>
</div>
```

### Form Layout

```typescript
<form className="space-y-4 sm:space-y-6">
  {/* Single field */}
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg" />
  </div>

  {/* Two fields side by side on larger screens */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">First Name</label>
      <input className="w-full px-3 py-2 border rounded-lg" />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Last Name</label>
      <input className="w-full px-3 py-2 border rounded-lg" />
    </div>
  </div>

  {/* Submit button */}
  <button className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-primary text-white rounded-lg">
    Submit
  </button>
</form>
```

### Modal/Dialog

```typescript
<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-black/50" onClick={onClose} />

  {/* Modal - Bottom sheet on mobile, centered on desktop */}
  <div className="relative w-full sm:w-auto sm:max-w-lg sm:mx-4 bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-auto">
    <div className="p-4 sm:p-6">
      {content}
    </div>
  </div>
</div>
```

## Typography Scale

```typescript
{/* Headings */}
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold" />
<h2 className="text-xl sm:text-2xl md:text-3xl font-bold" />
<h3 className="text-lg sm:text-xl md:text-2xl font-semibold" />
<h4 className="text-base sm:text-lg font-semibold" />

{/* Body text */}
<p className="text-sm sm:text-base" />        {/* Standard */}
<p className="text-xs sm:text-sm" />          {/* Small */}
<p className="text-base sm:text-lg lg:text-xl" /> {/* Large */}
```

## Spacing Patterns

```typescript
{/* Section spacing */}
<section className="py-8 sm:py-12 lg:py-16 xl:py-20" />

{/* Container padding */}
<div className="px-4 sm:px-6 lg:px-8" />

{/* Gap between items */}
<div className="gap-3 sm:gap-4 lg:gap-6" />

{/* Margin between sections */}
<div className="mt-6 sm:mt-8 lg:mt-12" />
```

## Navigation Patterns

### Header with Mobile Menu

```typescript
<header className="sticky top-0 z-40 bg-white border-b">
  <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
    {/* Logo */}
    <Logo className="h-8 sm:h-10" />

    {/* Desktop nav - hidden on mobile */}
    <nav className="hidden lg:flex items-center gap-6">
      {navItems.map(item => <NavLink key={item.href} {...item} />)}
    </nav>

    {/* Mobile menu button - shown on mobile only */}
    <button className="lg:hidden p-2">
      <Menu size={24} />
    </button>
  </div>
</header>
```

### Breadcrumbs

```typescript
<nav className="flex items-center text-sm overflow-x-auto pb-2">
  {/* Hide middle items on mobile */}
  {breadcrumbs.map((item, index) => (
    <React.Fragment key={item.href}>
      {index > 0 && <ChevronRight className="mx-1 sm:mx-2 shrink-0" size={16} />}
      <Link
        href={item.href}
        className={cn(
          "whitespace-nowrap",
          index > 0 && index < breadcrumbs.length - 1 && "hidden sm:inline"
        )}
      >
        {item.label}
      </Link>
    </React.Fragment>
  ))}
</nav>
```

## Image Handling

### Responsive Image

```typescript
<div className="relative w-full aspect-video sm:aspect-[16/9] lg:aspect-[21/9]">
  <Image
    src={image}
    alt={alt}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    className="object-cover"
  />
</div>
```

### Gallery Grid

```typescript
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2">
  {images.map((img, i) => (
    <div key={i} className="relative aspect-square">
      <Image src={img} alt="" fill className="object-cover" />
    </div>
  ))}
</div>
```

## Table Responsive Patterns

### Card View on Mobile

```typescript
{/* Table on desktop */}
<table className="hidden sm:table w-full">
  <thead>...</thead>
  <tbody>...</tbody>
</table>

{/* Card list on mobile */}
<div className="sm:hidden space-y-3">
  {data.map(item => (
    <div key={item.id} className="bg-white p-4 rounded-lg shadow">
      <div className="font-semibold">{item.name}</div>
      <div className="text-sm text-gray-600">{item.email}</div>
      <div className="text-sm">{item.role}</div>
    </div>
  ))}
</div>
```

### Horizontal Scroll Table

```typescript
<div className="overflow-x-auto -mx-4 sm:mx-0">
  <table className="min-w-full">
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</div>
```

## Bottom Padding for Mobile Nav

**Important:** Always add bottom padding to main content when using MobileBottomNav:

```typescript
{/* Page wrapper */}
<main className="pb-20 lg:pb-0">
  {/* Your page content */}
</main>

{/* Or with safe area */}
<main className="pb-24 sm:pb-20 lg:pb-0">
  {/* Your page content */}
</main>
```

## Hide/Show Utilities

```typescript
{/* Mobile only */}
<div className="block lg:hidden">Mobile content</div>

{/* Desktop only */}
<div className="hidden lg:block">Desktop content</div>

{/* Tablet and up */}
<div className="hidden sm:block">Tablet+ content</div>

{/* Mobile and tablet only */}
<div className="block lg:hidden">Mobile/Tablet content</div>
```

## Touch-Friendly Sizing

```typescript
{/* Minimum touch target: 44x44px */}
<button className="min-h-[44px] min-w-[44px] p-2 sm:p-3">
  <Icon size={20} />
</button>

{/* List items */}
<li className="py-3 sm:py-2">
  <Link className="block py-1">{item}</Link>
</li>
```
