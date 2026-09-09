import { useEffect, useState } from "react";

import {
  createDiscountCode,
  deleteDiscountCode,
  getDiscountCodes,
  updateDiscountCode,
} from "../../api/discounts";

import type {
  DiscountCode,
  DiscountCodeInput,
} from "../../api/discounts";

const emptyForm: DiscountCodeInput = {
  code: "",
  type: "percent",
  value: 0,
  active: true,
  valid_from: null,
  valid_until: null,
  minimum_order: null,
};

export default function AdminDiscounts() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState<DiscountCodeInput>(emptyForm);

  const [editingId, setEditingId] = useState<number | null>(null);

  // ========================================
  // HÄMTA RABATTKODER
  // ========================================

  useEffect(() => {
    async function loadDiscountCodes() {
      try {
        const data = await getDiscountCodes();
        setDiscountCodes(data);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Kunde inte hämta rabattkoder.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDiscountCodes();
  }, []);

  // ========================================
  // FORMULÄR
  // ========================================

  const handleChange = (
    field: keyof DiscountCodeInput,
    value: string | number | boolean | null,
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  // ========================================
  // SPARA / SKAPA
  // ========================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.code.trim()) {
      alert("Ange en rabattkod.");
      return;
    }

    if (form.value <= 0) {
      alert("Rabatten måste vara större än 0.");
      return;
    }

    if (form.type === "percent" && form.value > 100) {
      alert("Procentrabatten kan inte vara högre än 100 %.");
      return;
    }

    if (
      form.valid_from &&
      form.valid_until &&
      new Date(form.valid_until) < new Date(form.valid_from)
    ) {
      alert("Slutdatum kan inte vara före startdatum.");
      return;
    }

    try {
      const discountData: DiscountCodeInput = {
        ...form,
        code: form.code.trim().toUpperCase(),
      };

      if (editingId !== null) {
        await updateDiscountCode(editingId, discountData);

        setDiscountCodes((currentCodes) =>
          currentCodes.map((discount) =>
            discount.id === editingId
              ? {
                  ...discount,
                  ...discountData,
                }
              : discount,
          ),
        );

        alert("Rabattkoden har uppdaterats.");
      } else {
        await createDiscountCode(discountData);

        const updatedCodes = await getDiscountCodes();
        setDiscountCodes(updatedCodes);

        alert("Rabattkoden har skapats.");
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Något gick fel.");
      }
    }
  };

  // ========================================
  // REDIGERA
  // ========================================

  const handleEdit = (discount: DiscountCode) => {
    setEditingId(discount.id);

    setForm({
      code: discount.code,
      type: discount.type,
      value: Number(discount.value),
      active: Boolean(Number(discount.active)),
      valid_from: discount.valid_from
        ? discount.valid_from.slice(0, 16)
        : null,
      valid_until: discount.valid_until
        ? discount.valid_until.slice(0, 16)
        : null,
      minimum_order:
        discount.minimum_order !== null
          ? Number(discount.minimum_order)
          : null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // AVBRYT REDIGERING
  // ========================================

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // ========================================
  // TA BORT
  // ========================================

  const handleDelete = async (discount: DiscountCode) => {
    const confirmed = window.confirm(
      `Är du säker på att du vill ta bort rabattkoden "${discount.code}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDiscountCode(discount.id);

      setDiscountCodes((currentCodes) =>
        currentCodes.filter(
          (currentCode) => currentCode.id !== discount.id,
        ),
      );

      if (editingId === discount.id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Kunde inte ta bort rabattkoden.");
      }
    }
  };

  // ========================================
  // AKTIV / INAKTIV
  // ========================================

  const handleToggleActive = async (discount: DiscountCode) => {
    const updatedDiscount: DiscountCodeInput = {
      code: discount.code,
      type: discount.type,
      value: Number(discount.value),
      active: !Boolean(Number(discount.active)),
      valid_from: discount.valid_from,
      valid_until: discount.valid_until,
      minimum_order:
        discount.minimum_order !== null
          ? Number(discount.minimum_order)
          : null,
    };

    try {
      await updateDiscountCode(
        discount.id,
        updatedDiscount,
      );

      setDiscountCodes((currentCodes) =>
        currentCodes.map((currentCode) =>
          currentCode.id === discount.id
            ? {
                ...currentCode,
                active: updatedDiscount.active,
              }
            : currentCode,
        ),
      );
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Kunde inte ändra status.");
      }
    }
  };

  if (loading) {
    return <p>Laddar rabattkoder...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="admin-discounts">
      <h3 className="admin-create-title">
        {editingId !== null
          ? "Redigera rabattkod"
          : "Skapa rabattkod"}
      </h3>

      <form
        className="admin-discount-form"
        onSubmit={handleSubmit}
      >
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Rabattkod</label>

            <input
              className="admin-input"
              type="text"
              placeholder="SOMMAR10"
              value={form.code}
              onChange={(event) =>
                handleChange(
                  "code",
                  event.target.value.toUpperCase(),
                )
              }
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Typ</label>

            <select
              className="admin-input"
              value={form.type}
              onChange={(event) =>
                handleChange(
                  "type",
                  event.target.value as "percent" | "fixed",
                )
              }
            >
              <option value="percent">Procent</option>
              <option value="fixed">Fast belopp</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>
              {form.type === "percent"
                ? "Rabatt (%)"
                : "Rabatt (SEK)"}
            </label>

            <input
              className="admin-input"
              type="number"
              min="0"
              step="0.01"
              value={form.value || ""}
              onChange={(event) =>
                handleChange(
                  "value",
                  Number(event.target.value),
                )
              }
              required
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Gäller från</label>

            <input
              className="admin-input"
              type="datetime-local"
              value={form.valid_from ?? ""}
              onChange={(event) =>
                handleChange(
                  "valid_from",
                  event.target.value || null,
                )
              }
            />
          </div>

          <div className="admin-form-group">
            <label>Gäller till</label>

            <input
              className="admin-input"
              type="datetime-local"
              value={form.valid_until ?? ""}
              onChange={(event) =>
                handleChange(
                  "valid_until",
                  event.target.value || null,
                )
              }
            />
          </div>

          <div className="admin-form-group">
            <label>Minsta ordervärde (SEK)</label>

            <input
              className="admin-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="Valfritt"
              value={form.minimum_order ?? ""}
              onChange={(event) =>
                handleChange(
                  "minimum_order",
                  event.target.value === ""
                    ? null
                    : Number(event.target.value),
                )
              }
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                handleChange(
                  "active",
                  event.target.checked,
                )
              }
            />{" "}
            Aktiv
          </label>
        </div>

        <div className="admin-create-actions">
          <button
            className="admin-save-btn"
            type="submit"
          >
            {editingId !== null
              ? "Spara ändringar"
              : "Skapa rabattkod"}
          </button>

          {editingId !== null && (
            <button
              className="admin-btn"
              type="button"
              onClick={handleCancelEdit}
            >
              Avbryt
            </button>
          )}
        </div>
      </form>

      <div className="admin-table-header">
        <span>
          Rabattkoder — {discountCodes.length} st
        </span>
      </div>

      <div className="admin-discount-list">
        {discountCodes.length === 0 ? (
          <p>Inga rabattkoder skapade ännu.</p>
        ) : (
          discountCodes.map((discount) => (
            <div
              key={discount.id}
              className="admin-discount-row"
            >
              <div>
                <p>
                  <strong>{discount.code}</strong>
                </p>

                <p>
                  {discount.type === "percent"
                    ? `${discount.value} %`
                    : `${discount.value} SEK`}
                </p>
              </div>

              <div>
                <p>
                  Från:{" "}
                  {discount.valid_from
                    ? new Date(
                        discount.valid_from,
                      ).toLocaleString("sv-SE")
                    : "Ingen gräns"}
                </p>

                <p>
                  Till:{" "}
                  {discount.valid_until
                    ? new Date(
                        discount.valid_until,
                      ).toLocaleString("sv-SE")
                    : "Ingen gräns"}
                </p>
              </div>

              <div>
                <p>
                  Minsta order:{" "}
                  {discount.minimum_order !== null
                    ? `${discount.minimum_order} SEK`
                    : "Ingen"}
                </p>

                <p>
                  Status:{" "}
                  {Boolean(Number(discount.active))
                    ? "Aktiv"
                    : "Inaktiv"}
                </p>
              </div>

              <div className="admin-discount-actions">
                <button
                  className="admin-btn"
                  type="button"
                  onClick={() =>
                    handleEdit(discount)
                  }
                >
                  Ändra
                </button>

                <button
                  className="admin-btn"
                  type="button"
                  onClick={() =>
                    handleToggleActive(discount)
                  }
                >
                  {Boolean(Number(discount.active))
                    ? "Inaktivera"
                    : "Aktivera"}
                </button>

                <button
                  className="admin-btn danger"
                  type="button"
                  onClick={() =>
                    handleDelete(discount)
                  }
                >
                  Ta bort
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}