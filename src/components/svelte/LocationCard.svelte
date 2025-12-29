<script lang="ts">
    import type { UIStrings } from "../../i18n/ui";

    export let t: UIStrings;

    // Location coordinates (Burj Khalifa as example - update with actual venue)
    const lat = 25.1972;
    const lng = 55.2744;
    const venueName = encodeURIComponent("Wedding Venue");

    // Universal map links - user can choose their preferred app
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const appleMapsUrl = `https://maps.apple.com/?ll=${lat},${lng}&q=${venueName}`;
    const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

    // Geo URI - prompts native map app on most devices
    const geoUri = `geo:${lat},${lng}?q=${lat},${lng}(${venueName})`;

    let showOptions = false;

    function handleMainClick(e: MouseEvent) {
        // On mobile, try geo URI first
        if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
            window.location.href = geoUri;
        } else {
            showOptions = true;
        }
    }

    function closeOptions() {
        showOptions = false;
    }
</script>

<div class="card anim-delay-3 animate-slide-in">
    <h2 class="text-lg text-center mb-2 text-white font-normal">
        {t["countdown.location"]}
    </h2>
    <p class="text-base text-white-70 text-center mb-4">
        {t["countdown.city"]}
    </p>

    <!-- Map preview with click to open -->
    <button
        class="map-button group"
        on:click={handleMainClick}
        aria-label="Open location in maps"
    >
        <div class="map-preview">
            <svg
                class="map-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
            <span class="map-text">Tap to open in Maps</span>
        </div>
    </button>
</div>

<!-- Map provider options modal -->
{#if showOptions}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div
        class="modal-overlay"
        on:click={closeOptions}
        on:keydown={(e) => e.key === "Escape" && closeOptions()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabindex="-1"
    >
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
        <div class="modal-content" on:click|stopPropagation>
            <h3
                id="modal-title"
                class="text-lg font-medium text-white text-center mb-4"
            >
                Choose Maps App
            </h3>
            <div class="flex flex-col gap-3">
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn"
                >
                    <svg
                        class="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        />
                    </svg>
                    Google Maps
                </a>
                <a
                    href={appleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn"
                >
                    <svg
                        class="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        />
                    </svg>
                    Apple Maps
                </a>
                <a
                    href={wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn"
                >
                    <svg
                        class="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    Waze
                </a>
            </div>
            <button
                class="mt-4 text-white-70 text-sm text-center w-full"
                on:click={closeOptions}
            >
                Cancel
            </button>
        </div>
    </div>
{/if}

<style>
    .map-button {
        width: 100%;
        height: clamp(120px, 20vh, 180px);
        min-height: 100px;
        border-radius: clamp(8px, 6px + 0.75vw, 12px);
        overflow: hidden;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.05) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
        cursor: pointer;
        transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
        contain: layout paint;
    }

    .map-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
    }

    .map-button:active {
        transform: scale(0.98);
    }

    .map-preview {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.75rem;
    }

    .map-icon {
        width: 48px;
        height: 48px;
        color: rgba(255, 255, 255, 0.8);
        transition: transform 0.2s ease;
    }

    .map-button:hover .map-icon {
        transform: scale(1.1);
    }

    .map-text {
        font-size: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
        color: rgba(255, 255, 255, 0.7);
    }

    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 1rem;
        animation: fadeIn 0.15s ease-out;
    }

    .modal-content {
        background: #4b0101;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: clamp(12px, 10px + 1vw, 20px);
        padding: 1.5rem;
        width: 100%;
        max-width: 320px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @media (orientation: landscape) and (max-height: 500px) {
        .map-button {
            height: clamp(100px, 30vw, 160px);
        }
    }
</style>
