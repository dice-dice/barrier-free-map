export type SpotCategory =
  | "toilet"
  | "ramp"
  | "elevator"
  | "parking"
  | "entrance"
  | "other";

export type SpotStatus = "pending" | "approved" | "rejected";

export type SpotSource = "user_submitted" | "openstreetmap";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      spots: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: SpotCategory;
          accessibility_features: string[];
          location: unknown;
          address: string | null;
          photo_urls: string[];
          status: SpotStatus;
          source: SpotSource;
          osm_type: string | null;
          osm_id: number | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: SpotCategory;
          accessibility_features?: string[];
          location: string;
          address?: string | null;
          photo_urls?: string[];
          status?: SpotStatus;
          source?: SpotSource;
          osm_type?: string | null;
          osm_id?: number | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: SpotCategory;
          accessibility_features?: string[];
          location?: string;
          address?: string | null;
          photo_urls?: string[];
          status?: SpotStatus;
          source?: SpotSource;
          osm_type?: string | null;
          osm_id?: number | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      spot_confirmations: {
        Row: {
          id: string;
          spot_id: string;
          user_id: string;
          is_accurate: boolean;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          spot_id: string;
          user_id: string;
          is_accurate: boolean;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          spot_id?: string;
          user_id?: string;
          is_accurate?: boolean;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      spot_details: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: SpotCategory;
          accessibility_features: string[];
          latitude: number;
          longitude: number;
          address: string | null;
          photo_urls: string[];
          source: SpotSource;
          created_by: string;
          created_at: string;
          updated_at: string;
          confirmed_count: number;
          disputed_count: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_nearby_spots: {
        Args: {
          lat: number;
          lng: number;
          radius_meters: number;
          category_filter?: SpotCategory | null;
        };
        Returns: {
          id: string;
          name: string;
          description: string | null;
          category: SpotCategory;
          accessibility_features: string[];
          latitude: number;
          longitude: number;
          address: string | null;
          photo_urls: string[];
          source: SpotSource;
          confirmed_count: number;
          disputed_count: number;
          created_by: string;
          created_at: string;
          updated_at: string;
          distance_meters: number;
        }[];
      };
      get_pending_spots: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          name: string;
          address: string | null;
          category: SpotCategory;
          latitude: number;
          longitude: number;
          created_at: string;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
