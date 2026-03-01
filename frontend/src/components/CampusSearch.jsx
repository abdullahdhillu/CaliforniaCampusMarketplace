import { useEffect, useMemo, useState } from "react";

export const CampusSearch = ({ value, campuses, onChange }) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedCampus = useMemo(() => {
    if (!value) return null;
    return campuses.find((c) => c.slug === value) || null;
  }, [value, campuses]);

  // When parent changes value (e.g., URL param changes), update displayed text
  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [value, isOpen]);

  const displayValue = isOpen ? search : (selectedCampus?.name || "");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return campuses;
    return campuses.filter((c) => {
      const name = c.name.toLowerCase();
      const city = (c.city || "").toLowerCase();
      const slug = c.slug.toLowerCase();
      return name.includes(term) || city.includes(term) || slug.includes(term);
    });
  }, [campuses, search]);

  const handleSelect = (campus) => {
    onChange(campus.slug);
    setIsOpen(false);
    setSearch("");
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setIsOpen(true);

    // Allow clearing campus filter (All campuses)
    if (val.trim() === "") onChange("");
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        placeholder="All campuses (type to filter)…"
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />

      {isOpen && campuses.length > 0 && (
        <>
          <div className="fixed inset-0 z-10" onMouseDown={() => setIsOpen(false)} />

          <div
            className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow-lg"
            onMouseDown={(e) => e.preventDefault()} // prevents blur/click issues
          >
            {/* Optional: explicit "All campuses" option */}
            <div
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
              onClick={() => {
                onChange("");
                setIsOpen(false);
                setSearch("");
              }}
            >
              All campuses
            </div>

            {filtered.length > 0 ? (
              filtered.map((campus) => (
                <div
                  key={campus.slug}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleSelect(campus)}
                >
                  {campus.name}
                  <span className="ml-2 text-xs text-gray-500">{campus.city}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No results found for "{search}"
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};