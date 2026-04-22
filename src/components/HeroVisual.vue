<script setup>
// Decorative isometric SVG PC tower with neon accents and orbiting tags.
// Pure SVG + CSS — no extra dependency, scales perfectly, zero asset bytes.
</script>

<template>
  <div class="hero-visual relative w-full max-w-md mx-auto" aria-hidden="true">
    <!-- Glow halo -->
    <div class="absolute inset-0 -z-10 blur-3xl opacity-60 bg-gradient-radial from-primary-500/40 via-neon-violet/20 to-transparent" />

    <svg viewBox="0 0 320 380" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto drop-shadow-[0_0_30px_rgba(0,229,255,0.25)]">
      <defs>
        <linearGradient id="case" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1e2438"/>
          <stop offset="1" stop-color="#0a0d14"/>
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#00e5ff" stop-opacity="0.15"/>
          <stop offset="1" stop-color="#a855f7" stop-opacity="0.05"/>
        </linearGradient>
        <linearGradient id="rgb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#00e5ff"/>
          <stop offset="0.5" stop-color="#a855f7"/>
          <stop offset="1" stop-color="#ff2bd6"/>
        </linearGradient>
      </defs>

      <!-- Floor reflection -->
      <ellipse cx="160" cy="362" rx="120" ry="10" fill="url(#rgb)" opacity="0.25"/>

      <!-- Tower main body -->
      <g class="tower-float">
        <rect x="60" y="40" width="200" height="300" rx="14" fill="url(#case)" stroke="#1f2937" stroke-width="1.5"/>

        <!-- Glass side panel -->
        <rect x="78" y="58" width="164" height="264" rx="6" fill="url(#glass)" stroke="rgba(0,229,255,0.25)" stroke-width="1"/>

        <!-- Internal silhouettes -->
        <!-- GPU horizontal -->
        <rect x="92" y="180" width="136" height="32" rx="4" fill="#171c2b" stroke="rgba(168,85,247,0.45)" stroke-width="1"/>
        <rect x="100" y="188" width="80" height="6" fill="#a855f7" opacity="0.6"/>
        <circle cx="216" cy="196" r="6" fill="none" stroke="rgba(168,85,247,0.6)" stroke-width="1.2"/>

        <!-- CPU + heatsink -->
        <rect x="100" y="100" width="60" height="60" rx="3" fill="#10141f" stroke="rgba(0,229,255,0.4)" stroke-width="1"/>
        <rect x="106" y="106" width="48" height="48" fill="#1e2438"/>
        <line x1="106" y1="118" x2="154" y2="118" stroke="rgba(0,229,255,0.3)" stroke-width="0.8"/>
        <line x1="106" y1="130" x2="154" y2="130" stroke="rgba(0,229,255,0.3)" stroke-width="0.8"/>
        <line x1="106" y1="142" x2="154" y2="142" stroke="rgba(0,229,255,0.3)" stroke-width="0.8"/>

        <!-- RAM sticks -->
        <rect x="174" y="100" width="6" height="60" fill="#171c2b" stroke="rgba(0,229,255,0.4)" stroke-width="0.8"/>
        <rect x="184" y="100" width="6" height="60" fill="#171c2b" stroke="rgba(0,229,255,0.4)" stroke-width="0.8"/>
        <rect x="194" y="100" width="6" height="60" fill="#171c2b" stroke="rgba(0,229,255,0.4)" stroke-width="0.8"/>
        <rect x="204" y="100" width="6" height="60" fill="#171c2b" stroke="rgba(0,229,255,0.4)" stroke-width="0.8"/>

        <!-- PSU shroud -->
        <rect x="78" y="270" width="164" height="52" rx="3" fill="#0a0d14" stroke="rgba(0,229,255,0.15)" stroke-width="1"/>

        <!-- Fans (front grille hint, top) -->
        <circle cx="100" cy="68" r="6" fill="none" stroke="rgba(0,229,255,0.4)" stroke-width="0.8"/>
        <circle cx="120" cy="68" r="6" fill="none" stroke="rgba(0,229,255,0.4)" stroke-width="0.8"/>
        <circle cx="140" cy="68" r="6" fill="none" stroke="rgba(0,229,255,0.4)" stroke-width="0.8"/>

        <!-- Power LED -->
        <circle cx="248" cy="50" r="2.5" fill="#00e5ff" class="led-pulse"/>

        <!-- RGB strip front edge -->
        <rect x="60" y="334" width="200" height="3" rx="1.5" fill="url(#rgb)" opacity="0.85"/>
      </g>

      <!-- Floating tag: GPU -->
      <g class="tag tag-gpu">
        <rect x="-10" y="0" width="78" height="22" rx="11" fill="rgba(168,85,247,0.15)" stroke="rgba(168,85,247,0.5)" stroke-width="1"/>
        <text x="29" y="15" font-family="system-ui, sans-serif" font-size="10" fill="#c084fc" text-anchor="middle" font-weight="700">RTX 4090</text>
      </g>

      <!-- Floating tag: CPU -->
      <g class="tag tag-cpu">
        <rect x="0" y="0" width="78" height="22" rx="11" fill="rgba(0,229,255,0.15)" stroke="rgba(0,229,255,0.5)" stroke-width="1"/>
        <text x="39" y="15" font-family="system-ui, sans-serif" font-size="10" fill="#00e5ff" text-anchor="middle" font-weight="700">7800X3D</text>
      </g>

      <!-- Floating tag: 4K -->
      <g class="tag tag-fps">
        <rect x="0" y="0" width="58" height="22" rx="11" fill="rgba(57,255,20,0.12)" stroke="rgba(57,255,20,0.5)" stroke-width="1"/>
        <text x="29" y="15" font-family="system-ui, sans-serif" font-size="10" fill="#39ff14" text-anchor="middle" font-weight="700">4K Ultra</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.tower-float {
  transform-origin: center center;
  animation: tower-float 6s ease-in-out infinite;
}

.led-pulse {
  animation: led-pulse 1.8s ease-in-out infinite;
}

.tag {
  filter: drop-shadow(0 4px 14px rgba(0, 229, 255, 0.25));
}

.tag-gpu {
  transform: translate(220px, 60px);
  animation: tag-float-1 7s ease-in-out infinite;
}

.tag-cpu {
  transform: translate(-30px, 110px);
  animation: tag-float-2 8s ease-in-out infinite;
}

.tag-fps {
  transform: translate(238px, 240px);
  animation: tag-float-3 9s ease-in-out infinite;
}

@keyframes tower-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(0.3deg); }
}

@keyframes led-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

@keyframes tag-float-1 {
  0%, 100% { transform: translate(220px, 60px); }
  50% { transform: translate(220px, 50px); }
}

@keyframes tag-float-2 {
  0%, 100% { transform: translate(-30px, 110px); }
  50% { transform: translate(-30px, 100px); }
}

@keyframes tag-float-3 {
  0%, 100% { transform: translate(238px, 240px); }
  50% { transform: translate(238px, 250px); }
}

@media (prefers-reduced-motion: reduce) {
  .tower-float, .led-pulse, .tag-gpu, .tag-cpu, .tag-fps {
    animation: none !important;
  }
}
</style>
