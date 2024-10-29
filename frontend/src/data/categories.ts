// src/data/categories.ts

interface SubCategory {
  [key: string]: string[];
}

export interface CategoryType {
  income: {
    [key: string]: SubCategory;
  };
  expense: {
    [key: string]: SubCategory;
  };
}export const categories: CategoryType = {
  income: {
    Salário: {
      Principal: ['Salário Mensal', '13º Salário', 'Salário de Férias'],
      Benefícios: ['Vale Alimentação', 'Vale Refeição', 'Vale Transporte', 'Auxílio Creche'],
      Bônus: ['Hora Extra', 'Bônus por Desempenho', 'Comissão de Vendas', 'Prêmios por Metas'],
    },
    Investimentos: {
      'Renda Fixa': ['Juros de Títulos Públicos', 'Rendimentos da Poupança', 'CDBs', 'LCIs e LCAs'],
      'Renda Variável': ['Dividendos de Ações', 'Lucro com Venda de Ações', 'Aluguel de Ações', 'Fundo Imobiliário'],
      'Criptoativos': ['Venda de Criptomoedas', 'Rendimentos de Staking'],
    },
    Aluguéis: {
      'Imóvel Residencial': ['Rendimento de Aluguel - Casa', 'Rendimento de Aluguel - Apartamento'],
      'Imóvel Comercial': ['Rendimento de Aluguel - Loja', 'Rendimento de Aluguel - Escritório'],
      'Veículos': ['Rendimento de Aluguel de Carro', 'Rendimento de Aluguel de Moto'],
    },
    Empreendimentos: {
      'Lucro Líquido': ['Lucro de Vendas', 'Lucro com Serviços'],
      'Parcerias': ['Rendimentos de Parcerias'],
    },
    Outros: {
      Reembolsos: ['Reembolso de Despesas de Trabalho', 'Reembolso de Viagens Corporativas'],
      Presentes: ['Dinheiro Recebido como Presente', 'Transferências Familiares'],
      Herança: ['Recebimento de Herança'],
      Loterias: ['Ganhos de Loteria'],
    },
  },
  expense: {
    Moradia: {
      Aluguel: ['Aluguel Mensal de Imóvel'],
      Condomínio: ['Taxa de Condomínio'],
      Contas: ['Conta de Água', 'Conta de Luz', 'Conta de Gás', 'Internet', 'TV a Cabo'],
      Manutenção: ['Reparos Domésticos', 'Serviços de Limpeza', 'Manutenção Preventiva'],
      Seguro: ['Seguro Residencial'],
    },
    Alimentação: {
      Supermercado: ['Compras de Alimentos', 'Produtos de Limpeza', 'Produtos de Higiene'],
      Restaurante: ['Almoços', 'Jantares'],
      Lanches: ['Cafés', 'Lanches Rápidos'],
      Delivery: ['Pedidos via iFood', 'Pedidos via Uber Eats'],
    },
    Transporte: {
      Carro: ['Combustível', 'Troca de Óleo', 'Manutenção Preventiva', 'IPVA', 'Licenciamento', 'Seguro Auto'],
      Moto: ['Combustível', 'Troca de Óleo', 'Manutenção'],
      Público: ['Ônibus', 'Metrô', 'Trem'],
      Aplicativos: ['Uber', '99 Táxi', 'Cabify'],
      Estacionamento: ['Estacionamento Mensal', 'Estacionamento Eventual'],
      Pedágio: ['Gastos com Pedágio'],
    },
    Saúde: {
      'Plano de Saúde': ['Mensalidade do Plano de Saúde', 'Co-participação'],
      Consultas: ['Consultas Médicas Gerais', 'Especialistas (Dermatologista, Cardiologista, etc.)'],
      Exames: ['Exames Laboratoriais', 'Raio-X', 'Ultrassonografia'],
      Medicamentos: ['Compra de Medicamentos com Receita', 'Medicamentos de Uso Contínuo', 'Suplementos'],
      Dentista: ['Consultas Odontológicas', 'Tratamento Ortodôntico', 'Limpeza Dental'],
      Terapias: ['Fisioterapia', 'Psicoterapia', 'Acupuntura'],
    },
    Educação: {
      Faculdade: ['Mensalidade de Faculdade', 'Cursos de Pós-Graduação'],
      Cursos: ['Cursos Online', 'Certificações Profissionais', 'Workshops', 'Aulas Particulares'],
      Materiais: ['Livros Didáticos', 'Materiais de Estudo', 'Equipamentos (Notebook, Tablet)'],
    },
    Lazer: {
      Viagens: ['Passagens Aéreas', 'Hospedagem', 'Pacotes de Viagem', 'Aluguel de Carro'],
      Entretenimento: ['Cinema', 'Shows', 'Teatro', 'Parques de Diversão'],
      Assinaturas: ['Netflix', 'Spotify', 'Amazon Prime Video', 'Jornais e Revistas'],
      Esportes: ['Academia', 'Esportes Coletivos', 'Equipamentos Esportivos'],
    },
    Pessoal: {
      Roupas: ['Vestuário Formal', 'Vestuário Casual', 'Sapatos'],
      Acessórios: ['Relógios', 'Joias', 'Bolsas'],
      Beleza: ['Corte de Cabelo', 'Manicure e Pedicure', 'Tratamentos Estéticos'],
      Eletrônicos: ['Celulares', 'Notebooks', 'Acessórios de Tecnologia'],
    },
    Outros: {
      Presentes: ['Presentes de Aniversário', 'Presentes de Casamento', 'Presentes de Natal'],
      Doações: ['Doações para Caridade', 'Doações Religiosas'],
      Imprevistos: ['Multas', 'Serviços de Emergência'],
      Diversos: ['Compras por Impulso', 'Despesas Não Planejadas'],
    },
  },
};
