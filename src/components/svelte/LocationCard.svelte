<script lang="ts">
    import type { UIStrings } from "../../i18n/ui";

    export let t: UIStrings;

    // Burj Khalifa Google Maps link
    const mapsUrl =
        "https://www.google.com/maps/place/Burj+Khalifa/@25.197197,55.2743764,17z";

    // Google Maps embed URL for Burj Khalifa
    const embedUrl =
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178505453094!2d55.27218!3d25.197197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1703880000000!5m2!1sen!2sae";
</script>

<div class="location card animate-in delay-2">
    <h2 class="location-title">{t["countdown.location"]}</h2>
    <p class="location-city">{t["countdown.city"]}</p>

    <!-- Google Maps Embed -->
    <div class="map-wrapper">
        <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Wedding Location - Burj Khalifa"
        ></iframe>
    </div>

    <!-- Open in Google Maps button -->
    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" class="map-btn">
        <svg viewBox="0 0 24 24" fill="currentColor" class="map-icon">
            <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            />
        </svg>
        {t["countdown.openMaps"]}
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

    .map-wrapper {
        width: 100%;
        height: clamp(160px, 30vh, 220px);
        border-radius: 12px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.2);
        margin-bottom: 1rem;
    }

    .map-wrapper iframe {
        display: block;
        width: 100%;
        height: 100%;
        filter: saturate(0.8) contrast(1.1);
    }

    .map-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        font: inherit;
        font-size: 0.95rem;
        font-weight: 500;
        color: #fff;
        text-decoration: none;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 999px;
        transition:
            background 0.15s,
            transform 0.15s;
    }

    .map-btn:active {
        transform: scale(0.97);
    }

    @media (hover: hover) {
        .map-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    }

    .map-icon {
        width: 18px;
        height: 18px;
    }

    /* Landscape phones */
    @media (orientation: landscape) and (max-height: 500px) {
        .map-wrapper {
            height: 120px;
        }
    }
</style>
