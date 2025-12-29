<script lang="ts">
    import { onMount } from "svelte";
    import type { UIStrings } from "../../i18n/ui";

    export let t: UIStrings;
    export let redirectUrl: string;
    export let apiEndpoint: string;

    // Form state
    let name = "";
    let attending = "yes";
    let guests = "0";

    // UI state
    let isSubmitting = false;
    let showError = false;
    let showSuccess = false;
    let mounted = false;

    const STORAGE_KEY = "rsvp_form";

    // Load saved form data on mount
    onMount(() => {
        mounted = true;

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                name = data.name || "";
                attending = data.attending || "yes";
                guests = data.guests || "0";
            }
        } catch {}

        // Clear any previous submission state
        sessionStorage.removeItem("rsvp_submitted");
    });

    // Save form data (debounced)
    let saveTimer: ReturnType<typeof setTimeout>;
    function saveForm() {
        if (!mounted) return;
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({ name, attending, guests }),
                );
            } catch {}
        }, 300);
    }

    // Handle guests input
    function handleGuestsInput(e: Event) {
        const input = e.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, "");
        if (parseInt(value) > 9) value = "9";
        guests = value || "0";
        saveForm();
    }

    // Handle form submission
    async function handleSubmit() {
        if (isSubmitting || !name.trim()) return;

        isSubmitting = true;
        showError = false;

        const isAttending = attending === "yes";
        const payload = {
            name: name.trim(),
            attending: isAttending ? "Yes" : "No",
            guests: isAttending ? parseInt(guests) || 0 : 0,
        };

        // Store status for countdown page
        sessionStorage.setItem("rsvp_declined", isAttending ? "false" : "true");
        sessionStorage.setItem("rsvp_submitted", "true");

        try {
            // Try local API first
            const response = await fetch("/api/rsvp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("API error");
        } catch {
            // Fallback to Google Sheets
            try {
                await fetch(apiEndpoint, {
                    method: "POST",
                    mode: "no-cors",
                    body: JSON.stringify(payload),
                });
            } catch {}
        }

        // Clear saved form
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {}

        // Show success and redirect
        showSuccess = true;
        setTimeout(() => {
            window.location.replace(redirectUrl);
        }, 800);
    }

    $: showGuests = attending === "yes";
    $: {
        name;
        attending;
        guests;
        saveForm();
    }
</script>

<div class="form-container animate-in">
    <form on:submit|preventDefault={handleSubmit} class="card">
        <!-- Name -->
        <div class="field">
            <label for="name" class="label">{t["rsvp.name"]}</label>
            <input
                type="text"
                id="name"
                bind:value={name}
                class="input"
                required
                placeholder={t["rsvp.namePlaceholder"]}
                autocomplete="name"
                autocapitalize="words"
            />
        </div>

        <!-- Attending -->
        <div class="field">
            <span class="label">{t["rsvp.attending"]}</span>
            <div class="radio-group">
                <label class="radio-option">
                    <input type="radio" bind:group={attending} value="yes" />
                    <span
                        class="radio-btn"
                        class:active={attending === "yes"}
                        class:yes={true}
                    >
                        {t["rsvp.accept"]}
                    </span>
                </label>
                <label class="radio-option">
                    <input type="radio" bind:group={attending} value="no" />
                    <span
                        class="radio-btn"
                        class:active={attending === "no"}
                        class:no={true}
                    >
                        {t["rsvp.decline"]}
                    </span>
                </label>
            </div>
        </div>

        <!-- Guests (animated collapse) -->
        {#if showGuests}
            <div class="field guests-field">
                <label for="guests" class="label">{t["rsvp.guests"]}</label>
                <input
                    type="number"
                    id="guests"
                    value={guests}
                    on:input={handleGuestsInput}
                    class="input"
                    min="0"
                    max="9"
                    inputmode="numeric"
                />
            </div>
        {/if}

        <!-- Submit -->
        <button
            type="submit"
            class="btn submit-btn"
            disabled={isSubmitting || !name.trim()}
        >
            {#if isSubmitting}
                <span class="spinner"></span>
            {:else}
                {t["rsvp.submit"]}
            {/if}
        </button>

        {#if showError}
            <p class="error">{t["rsvp.error"]}</p>
        {/if}
    </form>
</div>

<!-- Success overlay -->
{#if showSuccess}
    <div class="success-overlay">
        <svg class="checkmark" viewBox="0 0 52 52">
            <circle
                cx="26"
                cy="26"
                r="24"
                fill="none"
                stroke="#4ade80"
                stroke-width="2"
            />
            <path
                d="M14 27l8 8 16-16"
                fill="none"
                stroke="#4ade80"
                stroke-width="3"
                stroke-linecap="round"
            />
        </svg>
    </div>
{/if}

<style>
    .form-container {
        width: 100%;
        max-width: 420px;
    }

    .field {
        margin-bottom: 1.25rem;
    }

    .label {
        display: block;
        font-size: 0.95rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 0.5rem;
        text-align: start;
    }

    .radio-group {
        display: flex;
        gap: 0.75rem;
    }

    .radio-option {
        flex: 1;
        cursor: pointer;
    }

    .radio-option input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    .radio-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        padding: 0.75rem;
        font-size: 0.95rem;
        font-weight: 600;
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        transition: all 0.15s;
    }

    .radio-btn.active.yes {
        background: #2e7d32;
        border-color: #2e7d32;
    }

    .radio-btn.active.no {
        background: #c62828;
        border-color: #c62828;
    }

    .radio-option:active .radio-btn {
        transform: scale(0.98);
    }

    .guests-field {
        animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .submit-btn {
        margin-top: 0.5rem;
        min-height: 52px;
        font-size: 1.05rem;
    }

    .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .error {
        text-align: center;
        color: #ff9999;
        font-size: 0.9rem;
        margin-top: 1rem;
    }

    .success-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(75, 1, 1, 0.95);
        z-index: 1000;
        animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .checkmark {
        width: 64px;
        height: 64px;
        animation: scaleIn 0.3s ease-out;
    }

    .checkmark circle {
        stroke-dasharray: 151;
        stroke-dashoffset: 151;
        animation: drawCircle 0.4s ease-out forwards;
    }

    .checkmark path {
        stroke-dasharray: 36;
        stroke-dashoffset: 36;
        animation: drawCheck 0.3s ease-out 0.2s forwards;
    }

    @keyframes scaleIn {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes drawCircle {
        to {
            stroke-dashoffset: 0;
        }
    }

    @keyframes drawCheck {
        to {
            stroke-dashoffset: 0;
        }
    }
</style>
