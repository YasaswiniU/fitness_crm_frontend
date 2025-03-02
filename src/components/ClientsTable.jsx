import React, { useEffect, useMemo, useCallback, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://fitness-crm-backend.onrender.com/clients/')
      .then(res => setClients(res.data))
      .catch(err => {
        console.error(err);
        message.error('Error fetching clients');
      });
  }, []);

  const columnDefs = useMemo(() => [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Email", field: "email" },
    { headerName: "Phone", field: "phone" },
    { headerName: "Initial Weight", field: "initial_weight" },
    { headerName: "Height", field: "height" },
    { headerName: "Age", field: "age" },
    { headerName: "Plan Type", field: "plan_type" },
    { headerName: "Plan Duration", field: "plan_duration" },
    { headerName: "Start Date", field: "start_date" },
    { 
      headerName: "End Date", 
      field: "end_date", 
      cellStyle: params => {
        const endDate = new Date(params.value);
        const now = new Date();
        const diffDays = (endDate - now) / (1000 * 3600 * 24);
        if(diffDays < 7) return { backgroundColor: 'red', color: 'white' };
        if(diffDays < 21) return { backgroundColor: 'orange', color: 'black' };
        return {};
      }
    },
    { 
      headerName: "Diet/Workout Sent", 
      field: "dietplans", 
      cellRendererFramework: (params) => {
        const hasPlan = params.value && params.value.length > 0;
        return (
          <span
            style={{
              display: 'inline-block',
              padding: '4px',
              backgroundColor: hasPlan ? 'green' : 'red',
              color: 'white'
            }}
          >
            {hasPlan ? 'Yes' : 'No'}
          </span>
        );
      }
    }
  ], []);

  const onRowClicked = useCallback((event) => {
    navigate(`/clients/${event.data.id}`);
  }, [navigate]);

  return (
    <div>
      <h2>Clients</h2>
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
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
