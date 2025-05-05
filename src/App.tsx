import React, { useState, useCallback } from "react";

interface HouseInfo {
  wifiName: string;
  wifiPassword: string;
  firstAidLocation: string;
  emergencyContact: string;
}

interface PetInfo {
  name: string;
  type: string;
  feedingInstructions: string;
  notes: string;
}

interface QuirkyNote {
  title: string;
  description: string;
}

const App: React.FC = () => {
  const [houseInfo, setHouseInfo] = useState<HouseInfo>({
    wifiName: "",
    wifiPassword: "",
    firstAidLocation: "",
    emergencyContact: "",
  });
  const [pets, setPets] = useState<PetInfo[]>([]);
  const [newPet, setNewPet] = useState<PetInfo>({
    name: "",
    type: "",
    feedingInstructions: "",
    notes: "",
  });
  const [quirkyNotes, setQuirkyNotes] = useState<QuirkyNote[]>([]);
  const [newNote, setNewNote] = useState<QuirkyNote>({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof HouseInfo, string>>
  >({});
  const [isEditing, setIsEditing] = useState(true);

  const validateInput = useCallback(() => {
    const newErrors: Partial<Record<keyof HouseInfo, string>> = {};
    if (!houseInfo.wifiName) newErrors.wifiName = "WiFi name is required";
    if (!houseInfo.wifiPassword)
      newErrors.wifiPassword = "WiFi password is required";
    if (!houseInfo.firstAidLocation)
      newErrors.firstAidLocation = "First aid kit location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [houseInfo]);

  const handleHouseInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setHouseInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddPet = () => {
    if (newPet.name && newPet.type) {
      setPets((prev) => [...prev, newPet]);
      setNewPet({ name: "", type: "", feedingInstructions: "", notes: "" });
    }
  };

  const handleAddNote = () => {
    if (newNote.title && newNote.description) {
      setQuirkyNotes((prev) => [...prev, newNote]);
      setNewNote({ title: "", description: "" });
    }
  };

  const handleToggleMode = () => {
    if (isEditing || validateInput()) {
      setIsEditing(!isEditing);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Guest Information Sheet
        </h1>

        <button
          onClick={handleToggleMode}
          className="mb-6 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label={isEditing ? "Switch to view mode" : "Switch to edit mode"}
        >
          {isEditing ? "View as Guest" : "Edit Information"}
        </button>

        {/* House Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            House Information
          </h2>
          {isEditing ? (
            <div className="space-y-4">
              {Object.entries(houseInfo).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </label>
                  <input
                    type={key.includes("Password") ? "password" : "text"}
                    name={key}
                    value={value}
                    onChange={handleHouseInfoChange}
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    aria-invalid={!!errors[key as keyof HouseInfo]}
                    aria-describedby={
                      errors[key as keyof HouseInfo]
                        ? `error-${key}`
                        : undefined
                    }
                  />
                  {errors[key as keyof HouseInfo] && (
                    <span
                      id={`error-${key}`}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors[key as keyof HouseInfo]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(houseInfo).map(
                ([key, value]) =>
                  value && (
                    <div key={key} className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </p>
                      <p className="text-gray-800">{value}</p>
                    </div>
                  )
              )}
            </div>
          )}
        </section>

        {/* Pet Information */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Pet Information
          </h2>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(newPet).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setNewPet((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddPet}
                disabled={!newPet.name || !newPet.type}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 focus:ring-2 focus:ring-green-500 focus:outline-none"
                aria-label="Add pet"
              >
                Add Pet
              </button>
            </div>
          ) : null}
          {pets.length > 0 ? (
            <div className="space-y-4 mt-4">
              {pets.map((pet, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium text-gray-700">
                    {pet.name} ({pet.type})
                  </p>
                  <p className="text-sm text-gray-600">
                    Feeding: {pet.feedingInstructions}
                  </p>
                  <p className="text-sm text-gray-600">
                    Notes: {pet.notes || "None"}
                  </p>
                </div>
              ))}
            </div>
          ) : !isEditing ? (
            <p className="text-gray-500 italic">No pet information provided.</p>
          ) : null}
        </section>

        {/* Quirky House Notes */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Quirky House Notes
          </h2>
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Title:
                  </label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    Description:
                  </label>
                  <textarea
                    value={newNote.description}
                    onChange={(e) =>
                      setNewNote((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={3}
                  />
                </div>
              </div>
              <button
                onClick={handleAddNote}
                disabled={!newNote.title || !newNote.description}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 focus:ring-2 focus:ring-green-500 focus:outline-none"
                aria-label="Add note"
              >
                Add Note
              </button>
            </div>
          ) : null}
          {quirkyNotes.length > 0 ? (
            <div className="space-y-4 mt-4">
              {quirkyNotes.map((note, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium text-gray-700">{note.title}</p>
                  <p className="text-sm text-gray-600">{note.description}</p>
                </div>
              ))}
            </div>
          ) : !isEditing ? (
            <p className="text-gray-500 italic">No quirky notes provided.</p>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default App;
