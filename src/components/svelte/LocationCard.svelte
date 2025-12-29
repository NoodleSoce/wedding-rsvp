<script lang="ts">
    import type { UIStrings } from "../../i18n/ui";

    export let t: UIStrings;

    // Venue coordinates - update these with actual venue
    const lat = 25.1972;
    const lng = 55.2744;
    const venueName = "Wedding Venue";

    // Simple Google Maps link - works everywhere
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
</script>

<div class="location card animate-in delay-2">
    <h2 class="location-title">{t["countdown.location"]}</h2>
    <p class="location-city">{t["countdown.city"]}</p>

    <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="map-link"
    >
        <div class="map-preview">
            <svg
                class="map-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
            >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
            <span class="map-text">{t["countdown.openMaps"]}</span>
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
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        margin: 0 0 1rem 0;
    }

    .map-link {
        display: block;
        text-decoration: none;
        color: inherit;
    }

    .map-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 2rem 1rem;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        transition:
            transform 0.15s,
            background 0.15s;
    }

    .map-preview:active {
        transform: scale(0.98);
    }

    @media (hover: hover) {
        .map-preview:hover {
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.08) 100%
            );
        }

        .map-preview:hover .map-icon {
            transform: scale(1.1);
        }
    }

    .map-icon {
        width: 40px;
        height: 40px;
        color: rgba(255, 255, 255, 0.8);
        transition: transform 0.2s;
    }

    .map-text {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
    }
</style>
