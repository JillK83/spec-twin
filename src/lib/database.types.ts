export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      brand_offsets: {
        Row: {
          brand_name: string
          category: string
          created_at: string | null
          default_contract_type: string | null
          default_fabric_class: string | null
          drift_adjustment: number | null
          fit_tag: string | null
          gender: string | null
          id: string
          last_validated: string | null
          notes: string | null
          sample_size: number | null
          structure_class: string | null
          tier: string | null
          updated_at: string | null
          weighted_offset: number | null
        }
        Insert: {
          brand_name: string
          category: string
          created_at?: string | null
          default_contract_type?: string | null
          default_fabric_class?: string | null
          drift_adjustment?: number | null
          fit_tag?: string | null
          gender?: string | null
          id?: string
          last_validated?: string | null
          notes?: string | null
          sample_size?: number | null
          structure_class?: string | null
          tier?: string | null
          updated_at?: string | null
          weighted_offset?: number | null
        }
        Update: {
          brand_name?: string
          category?: string
          created_at?: string | null
          default_contract_type?: string | null
          default_fabric_class?: string | null
          drift_adjustment?: number | null
          fit_tag?: string | null
          gender?: string | null
          id?: string
          last_validated?: string | null
          notes?: string | null
          sample_size?: number | null
          structure_class?: string | null
          tier?: string | null
          updated_at?: string | null
          weighted_offset?: number | null
        }
        Relationships: []
      }
      product_audits: {
        Row: {
          adjacent_size_down: string | null
          adjacent_size_up: string | null
          aging_note: string | null
          aging_warning: boolean | null
          brand_offset_id: string | null
          brand_offset_used: number | null
          confidence_level: string | null
          confidence_score: number | null
          contract_gate: boolean | null
          contract_gate_reason: string | null
          created_at: string | null
          drift_adjustment_used: number | null
          effective_offset: number | null
          engine_version: string | null
          fabric_gate: boolean | null
          fabric_gate_reason: string | null
          feedback_outcome: string | null
          fit_delta: number | null
          guidance: string | null
          hardware_note: string | null
          hardware_warning: boolean | null
          id: string
          message_type: string | null
          output_state: string | null
          reason_summary: string | null
          recommendation_summary: string | null
          recommended_size: string | null
          recovery_note: string | null
          recovery_warning: boolean | null
          reference_anchor_id: string | null
          rise_mismatch_note: string | null
          rise_mismatch_warning: boolean | null
          size_adjustment: number | null
          sizing_system_mismatch: boolean | null
          suggested_size: string | null
          target_brand: string
          target_category: string
          target_closure_type: string | null
          target_contract_type: string | null
          target_elastane_pct: number | null
          target_fabric_class: string | null
          target_fiber_content: string | null
          target_gender: string | null
          target_inseam_suggested: number | null
          target_layering_intent: string | null
          target_model: string | null
          target_poly_pct: number | null
          target_recovery_class: string | null
          target_rise: string | null
          target_silhouette: string | null
          target_size_original: string | null
          target_size_range_high: number | null
          target_size_range_low: number | null
          target_structure_class: string | null
          target_url: string | null
          updated_at: string | null
          user_feedback_date: string | null
          user_feedback_notes: string | null
          user_fit_rating: number | null
          user_id: string | null
          user_kept: boolean | null
          user_purchased: boolean | null
          user_return_reason: string | null
          warning_summary: string | null
        }
        Insert: {
          adjacent_size_down?: string | null
          adjacent_size_up?: string | null
          aging_note?: string | null
          aging_warning?: boolean | null
          brand_offset_id?: string | null
          brand_offset_used?: number | null
          confidence_level?: string | null
          confidence_score?: number | null
          contract_gate?: boolean | null
          contract_gate_reason?: string | null
          created_at?: string | null
          drift_adjustment_used?: number | null
          effective_offset?: number | null
          engine_version?: string | null
          fabric_gate?: boolean | null
          fabric_gate_reason?: string | null
          feedback_outcome?: string | null
          fit_delta?: number | null
          guidance?: string | null
          hardware_note?: string | null
          hardware_warning?: boolean | null
          id?: string
          message_type?: string | null
          output_state?: string | null
          reason_summary?: string | null
          recommendation_summary?: string | null
          recommended_size?: string | null
          recovery_note?: string | null
          recovery_warning?: boolean | null
          reference_anchor_id?: string | null
          rise_mismatch_note?: string | null
          rise_mismatch_warning?: boolean | null
          size_adjustment?: number | null
          sizing_system_mismatch?: boolean | null
          suggested_size?: string | null
          target_brand: string
          target_category: string
          target_closure_type?: string | null
          target_contract_type?: string | null
          target_elastane_pct?: number | null
          target_fabric_class?: string | null
          target_fiber_content?: string | null
          target_gender?: string | null
          target_inseam_suggested?: number | null
          target_layering_intent?: string | null
          target_model?: string | null
          target_poly_pct?: number | null
          target_recovery_class?: string | null
          target_rise?: string | null
          target_silhouette?: string | null
          target_size_original?: string | null
          target_size_range_high?: number | null
          target_size_range_low?: number | null
          target_structure_class?: string | null
          target_url?: string | null
          updated_at?: string | null
          user_feedback_date?: string | null
          user_feedback_notes?: string | null
          user_fit_rating?: number | null
          user_id?: string | null
          user_kept?: boolean | null
          user_purchased?: boolean | null
          user_return_reason?: string | null
          warning_summary?: string | null
        }
        Update: {
          adjacent_size_down?: string | null
          adjacent_size_up?: string | null
          aging_note?: string | null
          aging_warning?: boolean | null
          brand_offset_id?: string | null
          brand_offset_used?: number | null
          confidence_level?: string | null
          confidence_score?: number | null
          contract_gate?: boolean | null
          contract_gate_reason?: string | null
          created_at?: string | null
          drift_adjustment_used?: number | null
          effective_offset?: number | null
          engine_version?: string | null
          fabric_gate?: boolean | null
          fabric_gate_reason?: string | null
          feedback_outcome?: string | null
          fit_delta?: number | null
          guidance?: string | null
          hardware_note?: string | null
          hardware_warning?: boolean | null
          id?: string
          message_type?: string | null
          output_state?: string | null
          reason_summary?: string | null
          recommendation_summary?: string | null
          recommended_size?: string | null
          recovery_note?: string | null
          recovery_warning?: boolean | null
          reference_anchor_id?: string | null
          rise_mismatch_note?: string | null
          rise_mismatch_warning?: boolean | null
          size_adjustment?: number | null
          sizing_system_mismatch?: boolean | null
          suggested_size?: string | null
          target_brand?: string
          target_category?: string
          target_closure_type?: string | null
          target_contract_type?: string | null
          target_elastane_pct?: number | null
          target_fabric_class?: string | null
          target_fiber_content?: string | null
          target_gender?: string | null
          target_inseam_suggested?: number | null
          target_layering_intent?: string | null
          target_model?: string | null
          target_poly_pct?: number | null
          target_recovery_class?: string | null
          target_rise?: string | null
          target_silhouette?: string | null
          target_size_original?: string | null
          target_size_range_high?: number | null
          target_size_range_low?: number | null
          target_structure_class?: string | null
          target_url?: string | null
          updated_at?: string | null
          user_feedback_date?: string | null
          user_feedback_notes?: string | null
          user_fit_rating?: number | null
          user_id?: string | null
          user_kept?: boolean | null
          user_purchased?: boolean | null
          user_return_reason?: string | null
          warning_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_audits_brand_offset_id_fkey"
            columns: ["brand_offset_id"]
            isOneToOne: false
            referencedRelation: "brand_offsets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_audits_reference_anchor_id_fkey"
            columns: ["reference_anchor_id"]
            isOneToOne: false
            referencedRelation: "user_anchors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_anchors: {
        Row: {
          anchor_inseam: number | null
          body_shape: string | null
          brand_model: string
          brand_name: string
          category: string
          closure_type: string | null
          contract_type: string | null
          created_at: string | null
          elastane_pct: number | null
          fabric_class: string | null
          fabric_preference: string | null
          fabric_preference_secondary: Json | null
          fiber_content: string | null
          gender: string | null
          id: string
          is_demo_anchor: boolean | null
          layering_intent: string | null
          model_name: string | null
          parser_confidence: number | null
          poly_pct: number | null
          preferred_inseam_overrides: Json | null
          recovery_class: string | null
          rise: string | null
          silhouette: string | null
          size: string
          size_range_high: number | null
          size_range_low: number | null
          structure_class: string | null
          user_id: string | null
          user_notes: string | null
          weighted_offset: number | null
        }
        Insert: {
          anchor_inseam?: number | null
          body_shape?: string | null
          brand_model: string
          brand_name: string
          category: string
          closure_type?: string | null
          contract_type?: string | null
          created_at?: string | null
          elastane_pct?: number | null
          fabric_class?: string | null
          fabric_preference?: string | null
          fabric_preference_secondary?: Json | null
          fiber_content?: string | null
          gender?: string | null
          id?: string
          is_demo_anchor?: boolean | null
          layering_intent?: string | null
          model_name?: string | null
          parser_confidence?: number | null
          poly_pct?: number | null
          preferred_inseam_overrides?: Json | null
          recovery_class?: string | null
          rise?: string | null
          silhouette?: string | null
          size: string
          size_range_high?: number | null
          size_range_low?: number | null
          structure_class?: string | null
          user_id?: string | null
          user_notes?: string | null
          weighted_offset?: number | null
        }
        Update: {
          anchor_inseam?: number | null
          body_shape?: string | null
          brand_model?: string
          brand_name?: string
          category?: string
          closure_type?: string | null
          contract_type?: string | null
          created_at?: string | null
          elastane_pct?: number | null
          fabric_class?: string | null
          fabric_preference?: string | null
          fabric_preference_secondary?: Json | null
          fiber_content?: string | null
          gender?: string | null
          id?: string
          is_demo_anchor?: boolean | null
          layering_intent?: string | null
          model_name?: string | null
          parser_confidence?: number | null
          poly_pct?: number | null
          preferred_inseam_overrides?: Json | null
          recovery_class?: string | null
          rise?: string | null
          silhouette?: string | null
          size?: string
          size_range_high?: number | null
          size_range_low?: number | null
          structure_class?: string | null
          user_id?: string | null
          user_notes?: string | null
          weighted_offset?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ─── Convenience row types ────────────────────────────────────────────────────

export type UserAnchor = Tables<'user_anchors'>
export type BrandOffset = Tables<'brand_offsets'>
export type ProductAudit = Tables<'product_audits'>

// ─── Named string-union types (columns are text in Postgres, typed here) ─────

export type FabricClass    = 'rigid' | 'comfort_stretch' | 'high_stretch'
export type RecoveryClass  = 'low' | 'moderate' | 'high' | 'unknown'
export type ContractType   = 'precision' | 'range'
export type ClosureType    = 'zipper' | 'button_fly' | 'elastic' | 'drawstring' | 'none'
export type Gender         = 'mens' | 'womens' | 'unisex'
export type OutputState    = 'verified_fit' | 'fit_advisory' | 'smart_estimate'
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW'
