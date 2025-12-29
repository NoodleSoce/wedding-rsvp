<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { UIStrings } from "../../i18n/ui";

    export let t: UIStrings;
    export let targetDate: number;

    let declined = false;
    let days = "--";
    let hours = "--";
    let minutes = "--";
    let seconds = "--";
    let expired = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    // Constants for performance
    const DAY = 86400000;
    const HOUR = 3600000;
    const MIN = 60000;
    const SEC = 1000;

    function tick() {
        const diff = targetDate - Date.now();

        if (diff <= 0) {
            expired = true;
            if (timer) clearInterval(timer);
            return;
        }

        days = String((diff / DAY) | 0).padStart(2, "0");
        hours = String(((diff % DAY) / HOUR) | 0).padStart(2, "0");
        minutes = String(((diff % HOUR) / MIN) | 0).padStart(2, "0");
        seconds = String(((diff % MIN) / SEC) | 0).padStart(2, "0");
    }

    onMount(() => {
        // Check declined status from sessionStorage
        if (typeof sessionStorage !== "undefined") {
            declined = sessionStorage.getItem("rsvp_declined") === "true";
        }

        tick();
        timer = setInterval(tick, 1000);
    });

    onDestroy(() => {
        if (timer) clearInterval(timer);
    });

    $: title = declined ? t["countdown.titleDeclined"] : t["countdown.title"];
</script>

<div class="flex flex-col items-center gap-5 animate-fade-in">
    <h1
        class="text-xl font-light max-w-[min(90%,380px)] leading-tight px-4 text-center text-white anim-delay-1 animate-slide-in"
    >
        {title}
    </h1>

    {#if expired}
        <div
            class="timer anim-delay-2 animate-slide-in"
            role="timer"
            aria-live="polite"
        >
            <span class="text-xl font-semibold text-white"
                >{t["countdown.expired"]}</span
            >
        </div>
    {:else}
        <div
            class="timer flex items-center gap-3 contain-layout anim-delay-2 animate-slide-in"
            role="timer"
            aria-live="polite"
        >
            <div
                class="unit flex flex-col items-center min-w-[clamp(40px,10vw,56px)]"
            >
                <span
                    class="text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-bold tabular-nums leading-none text-white"
                    >{days}</span
                >
                <small class="text-sm text-white-70 mt-2"
                    >{t["countdown.days"]}</small
                >
            </div>
            <span
                class="sep text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-bold text-white-70 mb-6"
                aria-hidden="true">:</span
            >
            <div
                class="unit flex flex-col items-center min-w-[clamp(40px,10vw,56px)]"
            >
                <span
                    class="text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-bold tabular-nums leading-none text-white"
                    >{hours}</span
                >
                <small class="text-sm text-white-70 mt-2"
                    >{t["countdown.hours"]}</small
                >
            </div>
            <span
                class="sep text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-bold text-white-70 mb-6"
                aria-hidden="true">:</span
            >
            <div
                class="unit flex flex-col items-center min-w-[clamp(40px,10vw,56px)]"
            >
                <span
                    class="text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-bold tabular-nums leading-none text-white"
                    >{minutes}</span
                >
                <small class="text-sm text-white-70 mt-2"
                    >{t["countdown.minutes"]}</small
                >
            </div>
            <span
                class="sep text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-bold text-white-70 mb-6"
                aria-hidden="true">:</span
            >
            <div
                class="unit flex flex-col items-center min-w-[clamp(40px,10vw,56px)]"
            >
                <span
                    class="text-[clamp(1.5rem,1.2rem+1.5vw,2.25rem)] font-bold tabular-nums leading-none text-white"
                    >{seconds}</span
                >
                <small class="text-sm text-white-70 mt-2"
                    >{t["countdown.seconds"]}</small
                >
            </div>
        </div>
    {/if}
</div>
