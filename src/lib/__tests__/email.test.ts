import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSend = vi.fn();

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSend };
  },
}));

describe("sendEmail", () => {
  beforeEach(() => {
    vi.resetModules();
    mockSend.mockReset();
  });

  it("skips sending when RESEND_API_KEY is not set", async () => {
    const original = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;

    const { sendEmail } = await import("../email");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    await sendEmail({ to: "test@test.com", subject: "Hi", html: "<p>Hi</p>" });

    expect(mockSend).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("RESEND_API_KEY not set"),
      "test@test.com"
    );

    warn.mockRestore();
    process.env.RESEND_API_KEY = original;
  });

  it("sends email with correct parameters", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.EMAIL_FROM = "Test <test@example.com>";
    mockSend.mockResolvedValue({ error: null });

    const { sendEmail } = await import("../email");
    await sendEmail({
      to: "user@test.com",
      subject: "Welcome",
      html: "<p>Welcome</p>",
    });

    expect(mockSend).toHaveBeenCalledWith({
      from: "Test <test@example.com>",
      to: "user@test.com",
      subject: "Welcome",
      html: "<p>Welcome</p>",
    });
  });

  it("throws when Resend returns an error", async () => {
    process.env.RESEND_API_KEY = "test-key";
    mockSend.mockResolvedValue({
      error: { message: "Invalid API key" },
    });

    const { sendEmail } = await import("../email");

    await expect(
      sendEmail({ to: "user@test.com", subject: "Hi", html: "<p>Hi</p>" })
    ).rejects.toThrow("Failed to send email: Invalid API key");
  });

  it("uses default from address when EMAIL_FROM not set", async () => {
    process.env.RESEND_API_KEY = "test-key";
    delete process.env.EMAIL_FROM;
    mockSend.mockResolvedValue({ error: null });

    const { sendEmail } = await import("../email");
    await sendEmail({
      to: "user@test.com",
      subject: "Hi",
      html: "<p>Hi</p>",
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Nextly <noreply@nextly.live>",
      })
    );
  });
});
