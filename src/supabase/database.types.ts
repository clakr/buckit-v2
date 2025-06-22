export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      bucket_transactions: {
        Row: {
          amount: number;
          bucket_id: string;
          created_at: string;
          current_balance: number | null;
          description: string;
          id: string;
          type: Database["public"]["Enums"]["transaction_type"];
        };
        Insert: {
          amount: number;
          bucket_id: string;
          created_at?: string;
          current_balance?: number | null;
          description: string;
          id?: string;
          type: Database["public"]["Enums"]["transaction_type"];
        };
        Update: {
          amount?: number;
          bucket_id?: string;
          created_at?: string;
          current_balance?: number | null;
          description?: string;
          id?: string;
          type?: Database["public"]["Enums"]["transaction_type"];
        };
        Relationships: [
          {
            foreignKeyName: "bucket_transactions_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
      buckets: {
        Row: {
          created_at: string;
          current_amount: number;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_amount?: number;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          current_amount?: number;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      distribution_targets: {
        Row: {
          amount: number;
          amount_type: Database["public"]["Enums"]["distribution_amount_type"];
          created_at: string;
          description: string | null;
          distribution_id: string | null;
          id: string;
          target_id: string;
          target_type:
            | Database["public"]["Enums"]["distribution_target_type"]
            | null;
        };
        Insert: {
          amount: number;
          amount_type: Database["public"]["Enums"]["distribution_amount_type"];
          created_at?: string;
          description?: string | null;
          distribution_id?: string | null;
          id?: string;
          target_id: string;
          target_type?:
            | Database["public"]["Enums"]["distribution_target_type"]
            | null;
        };
        Update: {
          amount?: number;
          amount_type?: Database["public"]["Enums"]["distribution_amount_type"];
          created_at?: string;
          description?: string | null;
          distribution_id?: string | null;
          id?: string;
          target_id?: string;
          target_type?:
            | Database["public"]["Enums"]["distribution_target_type"]
            | null;
        };
        Relationships: [
          {
            foreignKeyName: "distribution_items_distribution_id_fkey";
            columns: ["distribution_id"];
            isOneToOne: false;
            referencedRelation: "distributions";
            referencedColumns: ["id"];
          },
        ];
      };
      distributions: {
        Row: {
          base_amount: number;
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          user_id: string;
        };
        Insert: {
          base_amount: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          user_id?: string;
        };
        Update: {
          base_amount?: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      expense_item_distributions: {
        Row: {
          amount: number;
          created_at: string;
          expense_item_id: string;
          expense_participant_id: string;
          id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          expense_item_id: string;
          expense_participant_id: string;
          id?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          expense_item_id?: string;
          expense_participant_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expense_item_distributions_expense_item_id_fkey";
            columns: ["expense_item_id"];
            isOneToOne: false;
            referencedRelation: "expense_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expense_item_distributions_expense_participant_id_fkey";
            columns: ["expense_participant_id"];
            isOneToOne: false;
            referencedRelation: "expense_participants";
            referencedColumns: ["id"];
          },
        ];
      };
      expense_items: {
        Row: {
          amount: number;
          created_at: string;
          description: string;
          expense_id: string;
          expense_participant_id: string;
          id: string;
          type: Database["public"]["Enums"]["expense_item_type"];
        };
        Insert: {
          amount: number;
          created_at?: string;
          description: string;
          expense_id: string;
          expense_participant_id: string;
          id?: string;
          type: Database["public"]["Enums"]["expense_item_type"];
        };
        Update: {
          amount?: number;
          created_at?: string;
          description?: string;
          expense_id?: string;
          expense_participant_id?: string;
          id?: string;
          type?: Database["public"]["Enums"]["expense_item_type"];
        };
        Relationships: [
          {
            foreignKeyName: "expense_items_expense_id_fkey";
            columns: ["expense_id"];
            isOneToOne: false;
            referencedRelation: "expenses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expense_items_expense_participant_id_fkey";
            columns: ["expense_participant_id"];
            isOneToOne: false;
            referencedRelation: "expense_participants";
            referencedColumns: ["id"];
          },
        ];
      };
      expense_participants: {
        Row: {
          created_at: string;
          expense_id: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          expense_id: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          expense_id?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expense_participants_expense_id_fkey";
            columns: ["expense_id"];
            isOneToOne: false;
            referencedRelation: "expenses";
            referencedColumns: ["id"];
          },
        ];
      };
      expense_settlements: {
        Row: {
          amount: number;
          created_at: string;
          expense_id: string;
          id: string;
          payer_participant_id: string;
          receiver_participant_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          expense_id: string;
          id?: string;
          payer_participant_id: string;
          receiver_participant_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          expense_id?: string;
          id?: string;
          payer_participant_id?: string;
          receiver_participant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "expense_settlements_expense_id_fkey";
            columns: ["expense_id"];
            isOneToOne: false;
            referencedRelation: "expenses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expense_settlements_payer_participant_id_fkey";
            columns: ["payer_participant_id"];
            isOneToOne: false;
            referencedRelation: "expense_participants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "expense_settlements_receiver_participant_id_fkey";
            columns: ["receiver_participant_id"];
            isOneToOne: false;
            referencedRelation: "expense_participants";
            referencedColumns: ["id"];
          },
        ];
      };
      expenses: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          status: Database["public"]["Enums"]["expense_status_type"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          status: Database["public"]["Enums"]["expense_status_type"];
          user_id?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          status?: Database["public"]["Enums"]["expense_status_type"];
          user_id?: string;
        };
        Relationships: [];
      };
      goal_transactions: {
        Row: {
          amount: number;
          created_at: string;
          current_balance: number | null;
          description: string;
          goal_id: string;
          id: string;
          type: Database["public"]["Enums"]["transaction_type"];
        };
        Insert: {
          amount: number;
          created_at?: string;
          current_balance?: number | null;
          description: string;
          goal_id: string;
          id?: string;
          type: Database["public"]["Enums"]["transaction_type"];
        };
        Update: {
          amount?: number;
          created_at?: string;
          current_balance?: number | null;
          description?: string;
          goal_id?: string;
          id?: string;
          type?: Database["public"]["Enums"]["transaction_type"];
        };
        Relationships: [
          {
            foreignKeyName: "goal_transactions_goal_id_fkey";
            columns: ["goal_id"];
            isOneToOne: false;
            referencedRelation: "goals";
            referencedColumns: ["id"];
          },
        ];
      };
      goals: {
        Row: {
          created_at: string;
          current_amount: number;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          target_amount: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_amount?: number;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          target_amount?: number;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          current_amount?: number;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          target_amount?: number;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      distribution_amount_type: "absolute" | "percentage";
      distribution_target_type: "bucket" | "goal";
      expense_item_type: "absolute" | "percentage" | "equal";
      expense_status_type: "draft" | "calculated" | "settled";
      transaction_type: "inbound" | "outbound";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      distribution_amount_type: ["absolute", "percentage"],
      distribution_target_type: ["bucket", "goal"],
      expense_item_type: ["absolute", "percentage", "equal"],
      expense_status_type: ["draft", "calculated", "settled"],
      transaction_type: ["inbound", "outbound"],
    },
  },
} as const;
