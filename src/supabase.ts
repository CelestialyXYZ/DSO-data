export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      constellations: {
        Row: {
          celestial_zone: string | null
          ecliptic_zone: string | null
          iau_code: string
          is_zodiacal_const: boolean | null
          name_en: string | null
          name_fr: string | null
          name_latin: string | null
          principal_star: string | null
          quadrant_zone: string | null
          surface_degrees: number | null
          surface_percent: number | null
          zodiacal_const_number: string | null
        }
        Insert: {
          celestial_zone?: string | null
          ecliptic_zone?: string | null
          iau_code: string
          is_zodiacal_const?: boolean | null
          name_en?: string | null
          name_fr?: string | null
          name_latin?: string | null
          principal_star?: string | null
          quadrant_zone?: string | null
          surface_degrees?: number | null
          surface_percent?: number | null
          zodiacal_const_number?: string | null
        }
        Update: {
          celestial_zone?: string | null
          ecliptic_zone?: string | null
          iau_code?: string
          is_zodiacal_const?: boolean | null
          name_en?: string | null
          name_fr?: string | null
          name_latin?: string | null
          principal_star?: string | null
          quadrant_zone?: string | null
          surface_degrees?: number | null
          surface_percent?: number | null
          zodiacal_const_number?: string | null
        }
        Relationships: []
      }
      dso_objects: {
        Row: {
          b_magnitude: number | null
          central_star_b_mag: number | null
          central_star_names: string[] | null
          central_star_u_mag: number | null
          central_star_v_mag: number | null
          common_names: Json | null
          constellation: string | null
          created_at: string
          declination: number | null
          h_magnitude: number | null
          hubble_morphological_type: string | null
          ic: number[] | null
          id: number
          identifiers: string[] | null
          j_magnitude: number | null
          k_magnitude: number | null
          keywords: string[] | null
          major_axis: number | null
          messier: number[] | null
          minor_axis: number | null
          ned_notes: string | null
          ngc: number[] | null
          openngc_notes: string | null
          parallax: number | null
          position_angle: number | null
          proper_motion_dec: number | null
          proper_motion_ra: number | null
          radial_velocity: number | null
          redshift: number | null
          right_ascension: number | null
          sources: Json | null
          surface_brightness: number | null
          type: string
          v_magnitude: number | null
        }
        Insert: {
          b_magnitude?: number | null
          central_star_b_mag?: number | null
          central_star_names?: string[] | null
          central_star_u_mag?: number | null
          central_star_v_mag?: number | null
          common_names?: Json | null
          constellation?: string | null
          created_at?: string
          declination?: number | null
          h_magnitude?: number | null
          hubble_morphological_type?: string | null
          ic?: number[] | null
          id?: number
          identifiers?: string[] | null
          j_magnitude?: number | null
          k_magnitude?: number | null
          keywords?: string[] | null
          major_axis?: number | null
          messier?: number[] | null
          minor_axis?: number | null
          ned_notes?: string | null
          ngc?: number[] | null
          openngc_notes?: string | null
          parallax?: number | null
          position_angle?: number | null
          proper_motion_dec?: number | null
          proper_motion_ra?: number | null
          radial_velocity?: number | null
          redshift?: number | null
          right_ascension?: number | null
          sources?: Json | null
          surface_brightness?: number | null
          type: string
          v_magnitude?: number | null
        }
        Update: {
          b_magnitude?: number | null
          central_star_b_mag?: number | null
          central_star_names?: string[] | null
          central_star_u_mag?: number | null
          central_star_v_mag?: number | null
          common_names?: Json | null
          constellation?: string | null
          created_at?: string
          declination?: number | null
          h_magnitude?: number | null
          hubble_morphological_type?: string | null
          ic?: number[] | null
          id?: number
          identifiers?: string[] | null
          j_magnitude?: number | null
          k_magnitude?: number | null
          keywords?: string[] | null
          major_axis?: number | null
          messier?: number[] | null
          minor_axis?: number | null
          ned_notes?: string | null
          ngc?: number[] | null
          openngc_notes?: string | null
          parallax?: number | null
          position_angle?: number | null
          proper_motion_dec?: number | null
          proper_motion_ra?: number | null
          radial_velocity?: number | null
          redshift?: number | null
          right_ascension?: number | null
          sources?: Json | null
          surface_brightness?: number | null
          type?: string
          v_magnitude?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dso_objects_constellation_fkey"
            columns: ["constellation"]
            isOneToOne: false
            referencedRelation: "constellations"
            referencedColumns: ["iau_code"]
          },
          {
            foreignKeyName: "dso_objects_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "dso_types"
            referencedColumns: ["type"]
          },
        ]
      }
      dso_objects_dev: {
        Row: {
          b_magnitude: number | null
          central_star_b_mag: number | null
          central_star_names: string[] | null
          central_star_u_mag: number | null
          central_star_v_mag: number | null
          common_names: Json | null
          constellation: string | null
          created_at: string
          declination: number | null
          h_magnitude: number | null
          hubble_morphological_type: string | null
          ic: number[] | null
          id: number
          identifiers: string[] | null
          j_magnitude: number | null
          k_magnitude: number | null
          keywords: string[] | null
          major_axis: number | null
          messier: number[] | null
          minor_axis: number | null
          ned_notes: string | null
          ngc: number[] | null
          openngc_notes: string | null
          parallax: number | null
          position_angle: number | null
          proper_motion_dec: number | null
          proper_motion_ra: number | null
          radial_velocity: number | null
          redshift: number | null
          right_ascension: number | null
          sources: Json | null
          surface_brightness: number | null
          type: string
          v_magnitude: number | null
        }
        Insert: {
          b_magnitude?: number | null
          central_star_b_mag?: number | null
          central_star_names?: string[] | null
          central_star_u_mag?: number | null
          central_star_v_mag?: number | null
          common_names?: Json | null
          constellation?: string | null
          created_at?: string
          declination?: number | null
          h_magnitude?: number | null
          hubble_morphological_type?: string | null
          ic?: number[] | null
          id?: number
          identifiers?: string[] | null
          j_magnitude?: number | null
          k_magnitude?: number | null
          keywords?: string[] | null
          major_axis?: number | null
          messier?: number[] | null
          minor_axis?: number | null
          ned_notes?: string | null
          ngc?: number[] | null
          openngc_notes?: string | null
          parallax?: number | null
          position_angle?: number | null
          proper_motion_dec?: number | null
          proper_motion_ra?: number | null
          radial_velocity?: number | null
          redshift?: number | null
          right_ascension?: number | null
          sources?: Json | null
          surface_brightness?: number | null
          type: string
          v_magnitude?: number | null
        }
        Update: {
          b_magnitude?: number | null
          central_star_b_mag?: number | null
          central_star_names?: string[] | null
          central_star_u_mag?: number | null
          central_star_v_mag?: number | null
          common_names?: Json | null
          constellation?: string | null
          created_at?: string
          declination?: number | null
          h_magnitude?: number | null
          hubble_morphological_type?: string | null
          ic?: number[] | null
          id?: number
          identifiers?: string[] | null
          j_magnitude?: number | null
          k_magnitude?: number | null
          keywords?: string[] | null
          major_axis?: number | null
          messier?: number[] | null
          minor_axis?: number | null
          ned_notes?: string | null
          ngc?: number[] | null
          openngc_notes?: string | null
          parallax?: number | null
          position_angle?: number | null
          proper_motion_dec?: number | null
          proper_motion_ra?: number | null
          radial_velocity?: number | null
          redshift?: number | null
          right_ascension?: number | null
          sources?: Json | null
          surface_brightness?: number | null
          type?: string
          v_magnitude?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dso_objects_duplicate_constellation_fkey"
            columns: ["constellation"]
            isOneToOne: false
            referencedRelation: "constellations"
            referencedColumns: ["iau_code"]
          },
          {
            foreignKeyName: "dso_objects_duplicate_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "dso_types"
            referencedColumns: ["type"]
          },
        ]
      }
      dso_types: {
        Row: {
          name_en: string | null
          name_fr: string | null
          type: string
        }
        Insert: {
          name_en?: string | null
          name_fr?: string | null
          type: string
        }
        Update: {
          name_en?: string | null
          name_fr?: string | null
          type?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
