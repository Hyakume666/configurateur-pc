<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: 'Politique de confidentialité | Loïc.config',
  meta: [{ name: 'robots', content: 'noindex, follow' }]
})
</script>

<template>
  <div class="container-page py-16 max-w-3xl">
    <h1 class="heading-display text-3xl sm:text-4xl text-text-primary mb-2">
      Politique de confidentialité
    </h1>
    <p class="text-sm text-text-muted mb-8">
      Conforme à la nouvelle Loi fédérale suisse sur la protection des données (nLPD, en vigueur depuis le 1<sup>er</sup> septembre 2023).
    </p>

    <section class="prose-legal space-y-6 text-text-secondary">
      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Responsable du traitement</h2>
        <p>
          <strong>Loïc Barthoulot</strong>, Neuchâtel, Suisse —
          <a href="mailto:contact@loicbarthoulot.ch" class="text-neon-blue hover:underline">contact@loicbarthoulot.ch</a>
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Données collectées</h2>
        <ul class="list-disc list-inside space-y-1">
          <li>
            <strong>Formulaire de demande</strong> : prénom, nom, email, téléphone (facultatif),
            message libre, configuration choisie, options sélectionnées.
          </li>
          <li>
            <strong>Données techniques</strong> : adresse IP transmise au serveur lors de l'envoi
            d'un formulaire (utilisée pour la prévention du spam et conservée temporairement
            par notre proxy d'envoi).
          </li>
          <li>
            <strong>Stockage local navigateur</strong> : vos réponses au quiz et le compteur de
            clics sur les liens partenaires sont sauvegardés dans le <code>localStorage</code> de
            votre navigateur, exclusivement sur votre appareil. Aucune transmission externe.
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Finalités</h2>
        <ul class="list-disc list-inside space-y-1">
          <li>Répondre à vos demandes de configuration et établir un devis personnalisé.</li>
          <li>Vous recontacter par email ou téléphone (uniquement si fourni).</li>
          <li>Améliorer le service via des statistiques agrégées (sans identification individuelle).</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Base légale</h2>
        <p>
          Traitement basé sur votre consentement explicite (envoi du formulaire) et sur
          l'intérêt légitime à fournir le service demandé.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Sous-traitants</h2>
        <ul class="list-disc list-inside space-y-1">
          <li>
            <strong>Brevo</strong> (anciennement Sendinblue, France/UE) — service d'envoi
            d'email transactionnel, adéquation européenne (RGPD).
          </li>
          <li>
            <strong>Cloudflare, Inc.</strong> (USA) — hébergement, fonctions serveur,
            conforme au cadre Data Privacy Framework UE-USA.
          </li>
          <li>
            <strong>Infomaniak Network SA</strong> (Suisse) — registrar et zone DNS, données hébergées en Suisse.
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Conservation des données</h2>
        <p>
          Les emails de demande sont conservés tant que la relation client est active,
          puis supprimés au plus tard 24 mois après le dernier échange. Les données
          stockées dans votre navigateur restent sous votre contrôle et peuvent être
          effacées à tout moment via les paramètres de votre navigateur.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Vos droits</h2>
        <p>Conformément à la nLPD, vous disposez des droits suivants :</p>
        <ul class="list-disc list-inside space-y-1 mt-2">
          <li>Droit d'accès à vos données personnelles</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement</li>
          <li>Droit d'opposition au traitement</li>
          <li>Droit à la portabilité</li>
        </ul>
        <p class="mt-2">
          Pour exercer ces droits, contactez :
          <a href="mailto:contact@loicbarthoulot.ch" class="text-neon-blue hover:underline">contact@loicbarthoulot.ch</a>.
          Vous pouvez également déposer une plainte auprès du
          <a href="https://www.edoeb.admin.ch" target="_blank" rel="noopener" class="text-neon-blue hover:underline">PFPDT</a>
          (Préposé fédéral à la protection des données).
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Cookies & traceurs</h2>
        <p>
          Ce site n'utilise <strong>aucun cookie de suivi</strong> ni outil d'analyse
          tiers (pas de Google Analytics, Meta Pixel, etc.). Seul le <code>localStorage</code>
          est utilisé pour mémoriser votre progression dans le quiz et pour le tableau
          de bord interne. Aucune donnée n'est partagée avec un tiers.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Sécurité</h2>
        <p>
          Connexion HTTPS systématique (TLS Let's Encrypt), validation stricte des
          formulaires côté client et serveur, clés API stockées exclusivement
          côté serveur, en-têtes de sécurité (CSP, HSTS) appliqués.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-2">Modifications</h2>
        <p>
          Cette politique peut être mise à jour à tout moment. La date de dernière
          révision sera indiquée ci-dessous.
        </p>
        <p class="text-sm text-text-muted mt-2">Dernière mise à jour : avril 2026.</p>
      </div>
    </section>
  </div>
</template>
