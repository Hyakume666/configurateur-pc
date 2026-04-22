<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: 'Mentions légales | Loïc.config',
  meta: [{ name: 'robots', content: 'noindex, follow' }]
})
</script>

<template>
  <div class="container-page py-16 max-w-3xl">
    <h1 class="heading-display text-3xl sm:text-4xl text-text-primary mb-8">Mentions légales</h1>

    <section class="prose-legal space-y-6 text-text-secondary">
      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Éditeur du site</h2>
        <p>
          <strong>Loïc Barthoulot</strong><br />
          Neuchâtel, Suisse<br />
          Email : <a href="mailto:contact@loicbarthoulot.ch" class="text-neon-blue hover:underline">contact@loicbarthoulot.ch</a>
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Activité</h2>
        <p>
          Service d'assistance à la configuration et à l'assemblage de PC sur mesure
          pour particuliers et professionnels en Suisse romande. Activité exercée
          à titre indépendant.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Hébergement</h2>
        <p>
          Site hébergé par Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA.
          Domaine et DNS gérés par Infomaniak Network SA, Genève, Suisse.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Propriété intellectuelle</h2>
        <p>
          L'ensemble des textes, graphiques, logos et éléments du site sont la
          propriété exclusive de Loïc Barthoulot, sauf mention contraire. Toute
          reproduction sans autorisation préalable est interdite. Les marques de
          composants (AMD, Intel, NVIDIA, ASUS, etc.) sont la propriété de leurs
          titulaires respectifs.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Liens d'affiliation</h2>
        <p>
          Ce site contient des liens d'affiliation vers des revendeurs partenaires
          (LDLC, Digitec, Amazon.ch). Lorsqu'un achat est effectué via l'un de ces
          liens, une commission peut être perçue, sans surcoût pour l'utilisateur.
          Les recommandations restent objectives et basées sur la pertinence
          technique de chaque configuration.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Limitation de responsabilité</h2>
        <p>
          Les informations techniques, prix et disponibilités présentés sont
          fournis à titre indicatif. Les prix réels et la disponibilité des
          composants restent ceux des revendeurs partenaires au moment de l'achat.
          Loïc Barthoulot ne saurait être tenu responsable d'éventuelles
          divergences ou de l'évolution des prix.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Droit applicable</h2>
        <p>
          Le présent site est soumis au droit suisse. Tout litige relève de la
          compétence des tribunaux du canton de Neuchâtel.
        </p>
      </div>
    </section>
  </div>
</template>
