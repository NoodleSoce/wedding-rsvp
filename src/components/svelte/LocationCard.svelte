<script lang="ts">
    import type { UIStrings } from "../../i18n/ui";

    export let t: UIStrings;

    // Burj Khalifa Google Maps link
    const mapsUrl =
        "https://www.google.com/maps/place/Burj+Khalifa/@25.197197,55.2743764,17z";

    // Static Google Maps image (no API key needed for basic embeds)
    // Using Google Maps Static API alternative - embed with interaction disabled
    const embedUrl =
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178505453094!2d55.27218!3d25.197197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1703880000000!5m2!1sen!2sae";
</script>

<div class="location card animate-in delay-2">
    <h2 class="location-title">{t["countdown.location"]}</h2>
    <p class="location-city">{t["countdown.city"]}</p>

    <!-- Clickable static map -->
    <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="map-link"
    >
        <div class="map-wrapper">
            <!-- Overlay to block map interaction and make entire area clickable -->
            <div class="map-overlay"></div>
            <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style="border:0;"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Wedding Location - Burj Khalifa"
                tabindex="-1"
            ></iframe>
        </div>
    </a>
</div>

<style>
    .location {
        text-align: center;
    }

    .location-title {
        font-size: 1.1rem;
        font-weight: 500;
        margin: 0 0 0.25rem 0;
    }

    .location-city {
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.7);
        margin: 0 0 1rem 0;
    }

    .map-link {
        display: block;
        text-decoration: none;
    }

    .map-wrapper {
        position: relative;
        width: 100%;
        height: clamp(140px, 28vh, 200px);
        border-radius: 12px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
        /* GPU acceleration for smooth transitions */
        will-change: transform;
        transform: translateZ(0);
    }

    .map-wrapper:active {
        transform: scale(0.98) translateZ(0);
    }

    @media (hover: hover) {
        .map-wrapper:hover {
            transform: translateY(-2px) translateZ(0);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }
    }

    /* Overlay to make map static (blocks all interaction) */
    .map-overlay {
        position: absolute;
        inset: 0;
        z-index: 1;
        cursor: pointer;
    }

    .map-wrapper iframe {
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none; /* Disable iframe interaction */
        filter: saturate(0.85) contrast(1.05);
    }

    /* Landscape phones */
    @media (orientation: landscape) and (max-height: 500px) {
        .map-wrapper {
            height: 110px;
        }
    }
</style>
