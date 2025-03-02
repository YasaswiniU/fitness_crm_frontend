import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error(err));
  }, []);

  const columnDefs = useMemo(() => [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Email", field: "email" },
    { headerName: "Phone", field: "phone" },
    { headerName: "Plan Type", field: "plan_type" },
    { headerName: "Plan Duration", field: "plan_duration" },
    { headerName: "Start Date", field: "start_date" },
    { headerName: "End Date", field: "end_date", cellClass: params => {
        const endDate = new Date(params.value);
        const now = new Date();
        const diffDays = (endDate - now) / (1000 * 3600 * 24);
        if(diffDays < 7) return 'bg-danger text-white';
        if(diffDays < 21) return 'bg-warning text-dark';
        return '';
      } 
    },
    { headerName: "Diet/Workout Sent", field: "dietplans", cellRenderer: params => {
        const hasPlan = params.value && params.value.length > 0;
        return `<span class="${hasPlan ? 'bg-success text-white' : 'bg-danger text-white'} p-1">${hasPlan ? 'Yes' : 'No'}</span>`;
      }
    }
  ], []);

  const onRowClicked = useCallback((event) => {
    navigate(`/clients/${event.data.id}`);
  }, [navigate]);

  return (
    <div>
      <h2>Clients</h2>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={clients}
          columnDefs={columnDefs}
          onRowClicked={onRowClicked}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

export default ClientsTable;
