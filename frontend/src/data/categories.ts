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
}

export const categories: CategoryType = {
  income: {
    Salário: {
      Principal: ['Salário'],
      Benefícios: ['Vale Alimentação', 'Vale Refeição'],
      Extra: ['Hora Extra', 'Bônus'],
    },
    Investimentos: {
      'Renda Fixa': ['Juros de Renda Fixa'],
      'Renda Variável': ['Dividendos', 'Lucro com Venda de Ações'],
    },
    Aluguéis: {
      'Imóvel A': ['Aluguel'],
      'Imóvel B': ['Aluguel'],
    },
    Outros: {
      Reembolso: ['Reembolso de Despesas'],
      Presente: ['Presente em Dinheiro'],
    },
  },
  expense: {
    Moradia: {
      Aluguel: ['Aluguel'],
      Condomínio: ['Taxa de Condomínio'],
      Contas: ['Água', 'Luz', 'Gás', 'Internet'],
      Manutenção: ['Reparos'],
    },
    Alimentação: {
      Supermercado: ['Compras'],
      Restaurante: ['Refeições'],
      Lanches: ['Lanches'],
    },
    Transporte: {
      Carro: ['Combustível', 'Manutenção'],
      Público: ['Ônibus/Metrô'],
    },
    Saúde: {
      'Plano de Saúde': ['Mensalidade'],
      Consultas: ['Consulta Médica'],
      Medicamentos: ['Farmácia'],
    },
    Educação: {
      Faculdade: ['Mensalidade'],
      Cursos: ['Curso Online'],
      Livros: ['Livros Técnicos'],
    },
    Lazer: {
      Viagens: ['Passagens Aéreas', 'Hospedagem'],
      Entretenimento: ['Cinema', 'Shows'],
    },
    Pessoal: {
      Roupas: ['Vestuário'],
      Beleza: ['Corte de Cabelo'],
    },
    Outros: {
      Presentes: ['Presente de Aniversário'],
    },
  },
};
