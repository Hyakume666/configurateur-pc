// Centralized icon registry for dynamic name->component lookup.
// Explicit named imports keep tree-shaking working: only the icons listed
// here ship in the bundle, instead of the whole lucide-vue-next library.
//
// When a new icon name is added to data/questions.json (or any JSON-driven
// dynamic icon), add it to this registry too.

import {
  Briefcase,
  Circle,
  Crosshair,
  Crown,
  Cpu,
  Gauge,
  Keyboard,
  Monitor,
  Package,
  Scale,
  Settings,
  Shield,
  Smile,
  Star,
  Sword,
  Terminal,
  TrendingUp,
  Video,
  VolumeX,
  Wallet,
  Wrench,
  Zap
} from 'lucide-vue-next'

const REGISTRY = {
  Briefcase,
  Crosshair,
  Crown,
  Cpu,
  Gauge,
  Keyboard,
  Monitor,
  Package,
  Scale,
  Settings,
  Shield,
  Smile,
  Star,
  Sword,
  Terminal,
  TrendingUp,
  Video,
  VolumeX,
  Wallet,
  Wrench,
  Zap
}

export function getIcon(name) {
  return REGISTRY[name] || Circle
}

export default REGISTRY
