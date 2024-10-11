// src/pages/Transactions/EditTransaction.tsx

import React from 'react';
import { useParams } from 'react-router-dom';

const EditTransaction: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Editar Transação</h1>
      <p>ID da Transação: {id}</p>
      {/* Formulário para editar a transação */}
    </div>
  );
};

export default EditTransaction;
