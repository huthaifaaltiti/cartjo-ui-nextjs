import { createTranslator } from "@/lib/server-translator";

export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  timeoutMs = 8000,
  locale: string = "en"
): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const t = createTranslator(locale);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        ...data,
      };
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(t("errors.api.timeout", "Request time out"));
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error(
      (error as Error)?.message ||
        t("errors.api.somethingWentWrong", "Error happened")
    );
  } finally {
    clearTimeout(timeout);
  }
};
