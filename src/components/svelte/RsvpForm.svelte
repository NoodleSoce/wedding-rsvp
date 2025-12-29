<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { navigate } from "astro:transitions/client";
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

    // DOM refs
    let nameInput: HTMLInputElement;
    let guestsInput: HTMLInputElement;
    let formEl: HTMLFormElement;
    let submitBtn: HTMLButtonElement;

    const STORAGE_KEY = "rsvp_form";

    // ===============================
    // KEYBOARD SCROLL HANDLING
    // ===============================
    let lastViewportHeight = 0;
    let isKeyboardOpen = false;

    function handleViewportResize() {
        if (!window.visualViewport) return;

        const currentHeight = window.visualViewport.height;
        const heightDiff = lastViewportHeight - currentHeight;

        if (heightDiff > 100 && !isKeyboardOpen) {
            isKeyboardOpen = true;
            scrollToFormBottom();
        } else if (heightDiff < -100 && isKeyboardOpen) {
            isKeyboardOpen = false;
        }

        lastViewportHeight = currentHeight;
    }

    function scrollToFormBottom() {
        setTimeout(() => {
            submitBtn?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 150);
    }

    // ===============================
    // FORM EVENTS
    // ===============================
    function handleInputFocus() {
        setTimeout(() => {
            scrollToFormBottom();
        }, 300);
    }

    function handleGuestsFocus() {
        setTimeout(() => {
            guestsInput?.select();
            scrollToFormBottom();
        }, 50);
    }

    function handleGuestsInput(e: Event) {
        const input = e.target as HTMLInputElement;
        let value = input.value;
        value = value.replace(/\D/g, "");
        if (value.length > 1) value = value.slice(-1);
        if (value === "") value = "0";
        if (parseInt(value) > 9) value = "9";
        guests = value;
        input.value = value;
        saveForm();
    }

    function handleAttendingChange(newValue: string) {
        attending = newValue;
        saveForm();
        if (isKeyboardOpen) {
            setTimeout(() => {
                nameInput?.focus();
            }, 10);
        }
    }

    // ===============================
    // DATA PERSISTENCE
    // ===============================
    function loadSavedData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                name = data.name || "";
                attending = data.attending || "yes";
                guests = data.guests || "0";
            }
        } catch {}
    }

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

    // ===============================
    // FORM SUBMISSION
    // ===============================
    async function handleSubmit() {
        if (isSubmitting || !name.trim()) return;
        (document.activeElement as HTMLElement)?.blur();
        isSubmitting = true;
        showError = false;

        const isAttending = attending === "yes";
        const payload = {
            name: name.trim(),
            attending: isAttending ? "Yes" : "No",
            guests: isAttending ? parseInt(guests) || 0 : 0,
        };

        sessionStorage.setItem("rsvp_declined", isAttending ? "false" : "true");
        sessionStorage.setItem("rsvp_submitted", "true");

        try {
            const response = await fetch("/api/rsvp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("API error");
        } catch {
            try {
                await fetch(apiEndpoint, {
                    method: "POST",
                    mode: "no-cors",
                    body: JSON.stringify(payload),
                });
            } catch {}
        }

        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {}

        showSuccess = true;
        setTimeout(() => {
            navigate(redirectUrl);
        }, 800);
    }

    onMount(() => {
        mounted = true;
        loadSavedData();
        sessionStorage.removeItem("rsvp_submitted");
        if (window.visualViewport) {
            lastViewportHeight = window.visualViewport.height;
            window.visualViewport.addEventListener(
                "resize",
                handleViewportResize,
            );
        }
        const handlePageShow = (e: PageTransitionEvent) => {
            if (e.persisted) {
                isSubmitting = false;
                showSuccess = false;
                showError = false;
            }
        };
        window.addEventListener("pageshow", handlePageShow);
        return () => {
            window.visualViewport?.removeEventListener(
                "resize",
                handleViewportResize,
            );
            window.removeEventListener("pageshow", handlePageShow);
        };
    });

    $: showGuests = attending === "yes";
    $: {
        name;
        saveForm();
    }
</script>

<div class="form-container animate-in">
    <!-- Removed card class from form, wrapping it instead or keeping it here but adding relative -->
    <div class="card relative-wrapper">
        <form
            bind:this={formEl}
            on:submit|preventDefault={handleSubmit}
            class="form-content"
        >
            <div class="field">
                <label for="name" class="label">{t["rsvp.name"]}</label>
                <input
                    type="text"
                    id="name"
                    bind:this={nameInput}
                    bind:value={name}
                    on:focus={handleInputFocus}
                    class="input"
                    required
                    placeholder={t["rsvp.namePlaceholder"]}
                    autocomplete="name"
                    autocapitalize="words"
                    enterkeyhint="next"
                />
            </div>
            <div class="field">
                <span class="label">{t["rsvp.attending"]}</span>
                <div class="radio-group">
                    <button
                        type="button"
                        class="radio-btn"
                        class:active={attending === "yes"}
                        class:yes={attending === "yes"}
                        on:click={() => handleAttendingChange("yes")}
                    >
                        {t["rsvp.accept"]}
                    </button>
                    <button
                        type="button"
                        class="radio-btn"
                        class:active={attending === "no"}
                        class:no={attending === "no"}
                        on:click={() => handleAttendingChange("no")}
                    >
                        {t["rsvp.decline"]}
                    </button>
                </div>
            </div>
            <div class="guests-section" class:open={showGuests}>
                <div class="guests-inner">
                    <div class="field">
                        <label for="guests" class="label"
                            >{t["rsvp.guests"]}</label
                        >
                        <input
                            type="number"
                            id="guests"
                            bind:this={guestsInput}
                            value={guests}
                            on:focus={handleGuestsFocus}
                            on:input={handleGuestsInput}
                            class="input guests-input"
                            min="0"
                            max="9"
                            inputmode="numeric"
                            enterkeyhint="done"
                        />
                    </div>
                </div>
            </div>
            <button
                type="submit"
                bind:this={submitBtn}
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

        <!-- Success overlay moved INSIDE card -->
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
    </div>
</div>

<style>
    .form-container {
        width: 100%;
        max-width: 420px;
    }

    /* Wrapper to contain success overlay */
    .relative-wrapper {
        position: relative;
        overflow: hidden; /* Ensures overlay is contained in corners */
    }

    .form-content {
        width: 100%;
    }

    /* SUCCESS OVERLAY - ABSOLUTE to cover only the card */
    .success-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(75, 1, 1, 0.95);
        z-index: 10;
        animation: fadeIn 0.2s ease-out;
        border-radius: 16px; /* Match card */
    }

    .field {
        margin-bottom: 1.25rem;
    }
    .label {
        display: block;
        font-size: 1.05rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 0.5rem;
        text-align: start;
    }
    .radio-group {
        display: flex;
        gap: 0.75rem;
    }
    .radio-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 52px;
        padding: 0.875rem;
        font: inherit;
        font-size: 1rem;
        font-weight: 600;
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        -webkit-tap-highlight-color: transparent;
    }
    .radio-btn:active {
        transform: scale(0.97);
    }
    .radio-btn.active.yes {
        background: #2e7d32;
        border-color: #2e7d32;
        transform: scale(1);
    }
    .radio-btn.active.no {
        background: #c62828;
        border-color: #c62828;
        transform: scale(1);
    }
    .guests-section {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.25s ease;
        margin-bottom: 0;
    }
    .guests-section.open {
        grid-template-rows: 1fr;
    }
    .guests-inner {
        overflow: hidden;
    }
    .guests-input {
        text-align: center;
        font-size: 1.25rem;
        font-weight: 600;
        letter-spacing: 0.05em;
    }
    .submit-btn {
        margin-top: 0.5rem;
        min-height: 54px;
        font-size: 1.1rem;
    }
    .spinner {
        width: 22px;
        height: 22px;
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
        font-size: 0.95rem;
        margin-top: 1rem;
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
