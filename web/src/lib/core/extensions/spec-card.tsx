import { z } from 'zod';
import { Extension } from '../types/extensions';
import {
    Smartphone,
    Monitor,
    Cpu,
    Camera,
    Battery,
    Zap,
    Weight,
    Ruler,
    Palette,
    Volume2,
    Wifi,
    Bluetooth,
    Usb,
    Settings,
    Star,
    TrendingUp,
    HardDrive,
    Database,
    Eye,
    Maximize,
    Headphones,
    Mic,
    Signal,
    Radio,
    Gauge,
    Activity,
    Package,
    Layers,
    Power,
    Plug,
    Archive,
    Folder,
    Shield,
    Lock,
    Gamepad,
    Trophy,
    Car,
    Fuel,
    Clock,
    Calendar,
    MapPin,
    Thermometer,
    Wind,
    Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const specCardSchema = z.object({
    title: z.string().describe('The main title for the specifications'),
    category: z.string().optional().describe('Optional category/group name'),
    image: z.string().optional().describe('Optional image URL for the product'),
    imageAlt: z.string().optional().describe('Alt text for the image'),
    specs: z
        .array(
            z.object({
                label: z.string().describe('The specification name'),
                value: z.string().describe('The specification value'),
                unit: z.string().optional().describe('The unit of measurement'),
                icon: z
                    .enum([
                        'smartphone',
                        'monitor',
                        'cpu',
                        'camera',
                        'battery',
                        'zap',
                        'weight',
                        'ruler',
                        'palette',
                        'volume',
                        'wifi',
                        'bluetooth',
                        'usb',
                        'settings',
                        'star',
                        'trending-up',
                        'hard-drive',
                        'database',
                        'eye',
                        'maximize',
                        'headphones',
                        'mic',
                        'signal',
                        'radio',
                        'gauge',
                        'activity',
                        'package',
                        'layers',
                        'power',
                        'plug',
                        'archive',
                        'folder',
                        'shield',
                        'lock',
                        'gamepad',
                        'trophy',
                        'car',
                        'fuel',
                        'clock',
                        'calendar',
                        'map-pin',
                        'thermometer',
                        'wind',
                        'sun',
                    ])
                    .describe('Icon to display for this spec'),
                highlight: z.boolean().optional().describe('Whether to highlight this spec'),
                description: z.string().optional().describe('Optional description'),
            }),
        )
        .describe('Array of specifications to display'),
});

const iconMap = {
    smartphone: Smartphone,
    monitor: Monitor,
    cpu: Cpu,
    camera: Camera,
    battery: Battery,
    zap: Zap,
    weight: Weight,
    ruler: Ruler,
    palette: Palette,
    volume: Volume2,
    wifi: Wifi,
    bluetooth: Bluetooth,
    usb: Usb,
    settings: Settings,
    star: Star,
    'trending-up': TrendingUp,
    'hard-drive': HardDrive,
    database: Database,
    eye: Eye,
    maximize: Maximize,
    headphones: Headphones,
    mic: Mic,
    signal: Signal,
    radio: Radio,
    gauge: Gauge,
    activity: Activity,
    package: Package,
    layers: Layers,
    power: Power,
    plug: Plug,
    archive: Archive,
    folder: Folder,
    shield: Shield,
    lock: Lock,
    gamepad: Gamepad,
    trophy: Trophy,
    car: Car,
    fuel: Fuel,
    clock: Clock,
    calendar: Calendar,
    'map-pin': MapPin,
    thermometer: Thermometer,
    wind: Wind,
    sun: Sun,
};

const specCardRenderer = ({
    title,
    category,
    image = 'https://placehold.co/600x400',
    imageAlt,
    specs,
}: Partial<z.infer<typeof specCardSchema>>) => {
    if (!specs || specs.length === 0) {
        return (
            <div className="border-muted-foreground/25 rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground text-sm">No specifications to display</p>
            </div>
        );
    }

    return (
        <div className="bg-card ms-8 max-w-md overflow-hidden rounded-lg border shadow-sm">
            {/* Image Section */}
            {image && (
                <div className="bg-muted relative aspect-video overflow-hidden">
                    <img
                        src={image}
                        alt={imageAlt || title || 'Product image'}
                        className="h-full w-full object-cover"
                    />
                    {category && (
                        <div className="absolute top-3 left-3">
                            <span className="bg-background/80 text-foreground rounded px-2 py-1 text-xs font-medium backdrop-blur-sm">
                                {category}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Content Section */}
            <div className="p-2">
                {/* Title */}
                {title && <h3 className="text-foreground mb-3 font-semibold">{title}</h3>}

                {/* Specifications */}
                <div className="grid grid-cols-2 gap-3">
                    {specs.map((spec, index) => {
                        const IconComponent = iconMap[spec.icon];
                        return (
                            <div
                                key={index}
                                className={cn('rounded-md p-2 transition-colors', {
                                    'bg-primary/5 border-primary/20 border': spec.highlight,
                                })}
                            >
                                <div className="flex items-center justify-start gap-1">
                                    <IconComponent
                                        className={cn(
                                            'size-4 shrink-0',
                                            spec.highlight ? 'text-primary' : 'text-muted-foreground',
                                        )}
                                    />
                                    <span className="text-foreground text-sm font-medium">{spec.label}</span>
                                    <div className="ms-auto flex items-center gap-1">
                                        <span
                                            className={`text-sm font-semibold ${
                                                spec.highlight ? 'text-primary' : 'text-foreground'
                                            }`}
                                        >
                                            {spec.value}
                                        </span>
                                        {spec.unit && (
                                            <span className="text-muted-foreground text-xs">{spec.unit}</span>
                                        )}
                                    </div>
                                </div>
                                {spec.description && (
                                    <p className="text-muted-foreground mt-0.5 text-xs">{spec.description}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const specCardExtension = {
    name: 'spec-card',
    prompt: 'use when displaying technical specifications, product details, or feature comparisons. ideal for phones, laptops, cars, or any product with measurable attributes that benefit from visual icons and organized display.',
    schema: specCardSchema,
    renderer: specCardRenderer,
} satisfies Extension<z.infer<typeof specCardSchema>>;
