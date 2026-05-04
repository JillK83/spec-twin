export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ─── Enum aliases (used across tables) ───────────────────────────────────────

export type FabricClass = 'rigid' | 'comfort_stretch' | 'high_stretch'
export type RecoveryClass = 'low' | 'moderate' | 'high' | 'unknown'
export type ContractType = 'precision' | 'range'
export type ClosureType = 'zipper' | 'button_fly' | 'elastic' | 'drawstring' | 'none'
export type StructureClass = 'structured' | 'semi-structured' | 'unstructured'
export type LayeringIntent = 'light' | 'medium' | 'heavy'
export type Gender = 'mens' | 'womens' | 'unisex'
export type FitTag = 'euro_slim' | 'vanity_high' | 'true_spec' | 'rigid_bias' | 'oversize_design'
export type Tier = 'A' | 'B' | 'C'
export type OutputState = 'verified_fit' | 'fit_advisory' | 'smart_estimate'
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW'
export type FeedbackOutcome = 'too_small' | 'too_big' | 'worked_as_expected'

// ─── Database interface ───────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      // ── user_anchors ────────────────────────────────────────────────────────
      // Base schema + ADDENDUM_V1 (structure_class, layering_intent)
      //             + ADDENDUM_V2 (gender)
      user_anchors: {
        Row: {
          id: string
          user_id: string | null
          brand_name: string
          model_name: string | null
          brand_model: string
          category: string
          size: string
          contract_type: ContractType | null
          size_range_low: number | null
          size_range_high: number | null
          fiber_content: string | null
          elastane_pct: number
          // null = poly_pct absent from product data → recovery_class = 'unknown'
          // 0    = confirmed 0% polyester           → recovery_class = 'low'
          poly_pct: number | null
          fabric_class: FabricClass | null
          recovery_class: RecoveryClass | null
          closure_type: ClosureType | null
          user_notes: string | null
          parser_confidence: number | null
          created_at: string
          // ADDENDUM_V1
          structure_class: StructureClass | null
          layering_intent: LayeringIntent | null
          // ADDENDUM_V2
          gender: Gender | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          brand_name: string
          model_name?: string | null
          brand_model: string
          category: string
          size: string
          contract_type?: ContractType | null
          size_range_low?: number | null
          size_range_high?: number | null
          fiber_content?: string | null
          elastane_pct?: number
          poly_pct?: number | null
          fabric_class?: FabricClass | null
          recovery_class?: RecoveryClass | null
          closure_type?: ClosureType | null
          user_notes?: string | null
          parser_confidence?: number | null
          created_at?: string
          structure_class?: StructureClass | null
          layering_intent?: LayeringIntent | null
          gender?: Gender | null
        }
        Update: Partial<Database['public']['Tables']['user_anchors']['Insert']>
      }

      // ── brand_offsets ───────────────────────────────────────────────────────
      // Base schema + ADDENDUM_V1 (structure_class)
      //             + ADDENDUM_V2 (gender, fit_tag, tier)
      // Unique constraint: (brand_name, category, gender)
      // weighted_offset is the authoritative column — never baseline_offset
      brand_offsets: {
        Row: {
          id: string
          brand_name: string
          category: string
          weighted_offset: number
          drift_adjustment: number
          default_fabric_class: FabricClass | null
          default_contract_type: ContractType | null
          // min 10 sample_size to activate drift
          sample_size: number
          last_validated: string | null
          created_at: string
          updated_at: string
          // ADDENDUM_V1
          structure_class: StructureClass | null
          // ADDENDUM_V2
          gender: Gender | null
          fit_tag: FitTag | null
          tier: Tier | null
          notes: string | null
        }
        Insert: {
          id?: string
          brand_name: string
          category: string
          weighted_offset?: number
          drift_adjustment?: number
          default_fabric_class?: FabricClass | null
          default_contract_type?: ContractType | null
          sample_size?: number
          last_validated?: string | null
          created_at?: string
          updated_at?: string
          structure_class?: StructureClass | null
          gender?: Gender | null
          fit_tag?: FitTag | null
          tier?: Tier | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['brand_offsets']['Insert']>
      }

      // ── product_audits ──────────────────────────────────────────────────────
      // Base schema + ADDENDUM_V1 (target_structure_class, target_layering_intent,
      //                            sizing_system_mismatch)
      //             + ADDENDUM_V2 (target_gender)
      // output_state must be snake_case: verified_fit | fit_advisory | smart_estimate
      // reference_anchor_id (not anchor_id)
      product_audits: {
        Row: {
          id: string
          user_id: string | null
          reference_anchor_id: string | null
          brand_offset_id: string | null
          target_brand: string
          target_model: string | null
          target_category: string
          target_url: string | null
          target_size_original: string | null
          target_contract_type: ContractType | null
          target_size_range_low: number | null
          target_size_range_high: number | null
          target_fiber_content: string | null
          target_elastane_pct: number
          target_poly_pct: number | null
          target_fabric_class: FabricClass | null
          target_recovery_class: RecoveryClass | null
          target_closure_type: ClosureType | null
          brand_offset_used: number
          drift_adjustment_used: number
          effective_offset: number
          fit_delta: number | null
          size_adjustment: number | null
          output_state: OutputState | null
          recommended_size: string | null
          suggested_size: string | null
          adjacent_size_down: string | null
          adjacent_size_up: string | null
          confidence_score: number | null
          confidence_level: ConfidenceLevel | null
          message_type: string | null
          reason_summary: string | null
          guidance: string | null
          warning_summary: string | null
          recommendation_summary: string | null
          fabric_gate: boolean
          fabric_gate_reason: string | null
          contract_gate: boolean
          contract_gate_reason: string | null
          recovery_warning: boolean
          recovery_note: string | null
          hardware_warning: boolean
          hardware_note: string | null
          aging_warning: boolean
          aging_note: string | null
          rise_mismatch_warning: boolean
          rise_mismatch_note: string | null
          user_purchased: boolean
          user_fit_rating: number | null
          user_kept: boolean | null
          user_return_reason: string | null
          user_feedback_notes: string | null
          feedback_outcome: FeedbackOutcome | null
          user_feedback_date: string | null
          engine_version: string | null
          created_at: string
          updated_at: string
          // ADDENDUM_V1
          target_structure_class: StructureClass | null
          target_layering_intent: LayeringIntent | null
          sizing_system_mismatch: boolean
          // ADDENDUM_V2
          target_gender: Gender | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          reference_anchor_id?: string | null
          brand_offset_id?: string | null
          target_brand: string
          target_model?: string | null
          target_category: string
          target_url?: string | null
          target_size_original?: string | null
          target_contract_type?: ContractType | null
          target_size_range_low?: number | null
          target_size_range_high?: number | null
          target_fiber_content?: string | null
          target_elastane_pct?: number
          target_poly_pct?: number | null
          target_fabric_class?: FabricClass | null
          target_recovery_class?: RecoveryClass | null
          target_closure_type?: ClosureType | null
          brand_offset_used?: number
          drift_adjustment_used?: number
          effective_offset?: number
          fit_delta?: number | null
          size_adjustment?: number | null
          output_state?: OutputState | null
          recommended_size?: string | null
          suggested_size?: string | null
          adjacent_size_down?: string | null
          adjacent_size_up?: string | null
          confidence_score?: number | null
          confidence_level?: ConfidenceLevel | null
          message_type?: string | null
          reason_summary?: string | null
          guidance?: string | null
          warning_summary?: string | null
          recommendation_summary?: string | null
          fabric_gate?: boolean
          fabric_gate_reason?: string | null
          contract_gate?: boolean
          contract_gate_reason?: string | null
          recovery_warning?: boolean
          recovery_note?: string | null
          hardware_warning?: boolean
          hardware_note?: string | null
          aging_warning?: boolean
          aging_note?: string | null
          rise_mismatch_warning?: boolean
          rise_mismatch_note?: string | null
          user_purchased?: boolean
          user_fit_rating?: number | null
          user_kept?: boolean | null
          user_return_reason?: string | null
          user_feedback_notes?: string | null
          feedback_outcome?: FeedbackOutcome | null
          user_feedback_date?: string | null
          engine_version?: string | null
          created_at?: string
          updated_at?: string
          target_structure_class?: StructureClass | null
          target_layering_intent?: LayeringIntent | null
          sizing_system_mismatch?: boolean
          target_gender?: Gender | null
        }
        Update: Partial<Database['public']['Tables']['product_audits']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// ─── Convenience row types ────────────────────────────────────────────────────

export type UserAnchor = Database['public']['Tables']['user_anchors']['Row']
export type BrandOffset = Database['public']['Tables']['brand_offsets']['Row']
export type ProductAudit = Database['public']['Tables']['product_audits']['Row']
