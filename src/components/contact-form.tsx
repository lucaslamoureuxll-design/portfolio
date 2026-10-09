"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/70 outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15";

/**
 * Formulaire de contact via Web3Forms (gratuit, sans backend).
 * Définissez NEXT_PUBLIC_WEB3FORMS_KEY ; sans clé, un lien mailto est proposé à la place.
 */
export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");

  if (!ACCESS_KEY) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-muted">Écrivez-moi directement :</p>
        <a href={`mailto:${email}`} className="mt-2 inline-block text-lg font-medium text-accent underline-offset-4 hover:underline">
          {email}
        </a>
      </div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");

    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          access_key: ACCESS_KEY,
          subject: `Nouveau message de ${data.name} via le portfolio`,
        }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Champ piège anti-spam (honeypot) : doit rester vide. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">Nom</span>
          <input name="name" required autoComplete="name" placeholder="Votre nom" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">E-mail</span>
          <input name="email" type="email" required autoComplete="email" placeholder="vous@exemple.com" className={inputClass} />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Message</span>
        <textarea name="message" required rows={6} placeholder="Parlez-moi de votre projet…" className={`${inputClass} resize-y`} />
      </label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 font-medium text-background transition hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? "Envoi…" : "Envoyer le message"}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === "success" && <span className="text-emerald-600 dark:text-emerald-400">Merci ! Votre message a bien été envoyé.</span>}
          {status === "error" && (
            <span className="text-red-600 dark:text-red-400">
              Une erreur est survenue. Réessayez ou écrivez à{" "}
              <a href={`mailto:${email}`} className="underline">
                {email}
              </a>
              .
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
