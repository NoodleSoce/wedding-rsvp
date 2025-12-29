<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { UIStrings } from "../../i18n/ui";

    export let t: UIStrings;
    export let targetDate: number;

    let days = "00";
    let hours = "00";
    let minutes = "00";
    let seconds = "00";
    let expired = false;
    let declined = false;
    let timer: ReturnType<typeof setInterval>;

    const DAY = 86400000;
    const HOUR = 3600000;
    const MIN = 60000;

    function update() {
        const diff = targetDate - Date.now();

        if (diff <= 0) {
            expired = true;
            days = hours = minutes = seconds = "00";
            clearInterval(timer);
            return;
        }

        days = String(Math.floor(diff / DAY)).padStart(2, "0");
        hours = String(Math.floor((diff % DAY) / HOUR)).padStart(2, "0");
        minutes = String(Math.floor((diff % HOUR) / MIN)).padStart(2, "0");
        seconds = String(Math.floor((diff % MIN) / 1000)).padStart(2, "0");
    }

    onMount(() => {
        // Check if user declined
        declined = sessionStorage.getItem("rsvp_declined") === "true";

        update();
        timer = setInterval(update, 1000);
    });

    onDestroy(() => {
        if (timer) clearInterval(timer);
    });

    $: title = declined ? t["countdown.titleDeclined"] : t["countdown.title"];
</script>

<div class="timer-wrapper">
    <h1 class="title animate-in">{title}</h1>

    {#if expired}
        <div class="expired animate-in delay-1">{t["countdown.expired"]}</div>
    {:else}
        <div class="timer animate-in delay-1" role="timer" aria-live="polite">
            <div class="unit">
                <span class="value">{days}</span>
                <span class="label">{t["countdown.days"]}</span>
            </div>
            <span class="sep">:</span>
            <div class="unit">
                <span class="value">{hours}</span>
                <span class="label">{t["countdown.hours"]}</span>
            </div>
            <span class="sep">:</span>
            <div class="unit">
                <span class="value">{minutes}</span>
                <span class="label">{t["countdown.minutes"]}</span>
            </div>
            <span class="sep">:</span>
            <div class="unit">
                <span class="value">{seconds}</span>
                <span class="label">{t["countdown.seconds"]}</span>
            </div>
        </div>
    {/if}
</div>

<style>
    .timer-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .title {
        /* INCREASED FONT SIZE */
        font-size: clamp(1.5rem, 1.3rem + 1.2vw, 2.2rem);
        font-weight: 400;
        line-height: 1.3;
        text-align: center;
        max-width: 400px;
        margin: 0;
        /* Improved text rendering */
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .timer {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .unit {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: clamp(44px, 12vw, 60px);
    }

    .value {
        font-size: clamp(1.6rem, 1.4rem + 1vw, 2.2rem);
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        line-height: 1;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .label {
        font-size: clamp(0.75rem, 0.7rem + 0.3vw, 0.9rem);
        color: rgba(255, 255, 255, 0.8);
        margin-top: 0.4rem;
        font-weight: 500;
    }

    .sep {
        font-size: clamp(1.2rem, 1rem + 0.5vw, 1.6rem);
        font-weight: 700;
        color: rgba(255, 255, 255, 0.6);
        padding-bottom: 1.5rem;
    }

    .expired {
        font-size: 1.5rem;
        font-weight: 600;
    }
</style>
