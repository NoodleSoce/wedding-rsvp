<script lang="ts">
    import type { UIStrings } from "../../i18n/ui";

    export let t: UIStrings;

    // Venue coordinates - update with actual venue
    const lat = 25.1972;
    const lng = 55.2744;
    const zoom = 15;

    // Google Maps link
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    // Static map image from Google (free, no API key needed for basic usage)
    // Using OpenStreetMap static tile as fallback (truly free, no limits)
    const mapPreviewUrl = `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&z=${zoom}&l=map&size=400,200&pt=${lng},${lat},pm2rdm`;
</script>

<div class="location card animate-in delay-2">
    <h2 class="location-title">{t["countdown.location"]}</h2>
    <p class="location-city">{t["countdown.city"]}</p>

    <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="map-link"
        aria-label={t["countdown.openMaps"]}
    >
        <!-- Map preview container -->
        <div class="map-container">
            <!-- Gradient overlay -->
            <div class="map-overlay"></div>

            <!-- Pin icon -->
            <div class="map-pin">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    />
                </svg>
            </div>

            <!-- "Open in Maps" text -->
            <span class="map-cta">{t["countdown.openMaps"]}</span>
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
        color: inherit;
    }

    .map-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: clamp(120px, 25vh, 180px);
        background: linear-gradient(
            135deg,
            rgba(100, 60, 60, 0.4) 0%,
            rgba(75, 45, 45, 0.6) 50%,
            rgba(60, 30, 30, 0.5) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        overflow: hidden;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }

    .map-container:active {
        transform: scale(0.98);
    }

    @media (hover: hover) {
        .map-container:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .map-container:hover .map-pin {
            transform: translateY(-4px) scale(1.1);
        }
    }

    .map-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            ellipse at center,
            transparent 0%,
            rgba(75, 1, 1, 0.3) 100%
        );
        pointer-events: none;
    }

    .map-pin {
        width: 48px;
        height: 48px;
        color: #fff;
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
        transition: transform 0.2s ease;
        animation: bounce 2s ease-in-out infinite;
    }

    .map-pin svg {
        width: 100%;
        height: 100%;
    }

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-6px);
        }
    }

    .map-cta {
        margin-top: 0.75rem;
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.8);
        padding: 0.4rem 1rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        transition: background 0.2s;
    }

    @media (hover: hover) {
        .map-container:hover .map-cta {
            background: rgba(255, 255, 255, 0.2);
        }
    }

    /* Landscape phones */
    @media (orientation: landscape) and (max-height: 500px) {
        .map-container {
            height: 100px;
        }
    }
</style>
