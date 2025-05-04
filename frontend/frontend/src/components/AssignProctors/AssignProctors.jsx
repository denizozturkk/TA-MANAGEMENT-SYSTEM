import React, { useState, useEffect } from 'react';

const AssignProctors = () => {
  const [proctors, setProctors] = useState([]);
  const [selectedProctor, setSelectedProctor] = useState('');
  const [assignmentStatus, setAssignmentStatus] = useState('');

  useEffect(() => {
    // Gerçek uygulamada, burada API çağrısı yaparak proctor listesini çekebilirsiniz.
    setProctors([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
      { id: 3, name: 'Mike Johnson' },
    ]);
  }, []);

  const handleAssign = () => {
    // API çağrısı ile seçilen proctor'ı atayabilirsiniz.
    setAssignmentStatus('Proctor başarıyla atandı!');
  };

  return (
    <div className="assign-proctors">
      <h2>Assign Proctors</h2>
      <div>
        <label htmlFor="proctorSelect">Proctor Seçiniz:</label>
        <select
          id="proctorSelect"
          value={selectedProctor}
          onChange={(e) => setSelectedProctor(e.target.value)}
        >
          <option value="">-- Proctor Seçiniz --</option>
          {proctors.map((proctor) => (
            <option key={proctor.id} value={proctor.id}>
              {proctor.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleAssign} disabled={!selectedProctor}>
        Proctor Ata
      </button>
      {assignmentStatus && <p>{assignmentStatus}</p>}
    </div>
  );
};

export default AssignProctors;
