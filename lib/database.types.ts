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
          created_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
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
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          spot_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          spot_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          spot_id?: string;
          user_id?: string;
          rating?: number;
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
          created_by: string;
          created_at: string;
          updated_at: string;
          average_rating: number;
          review_count: number;
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
          average_rating: number;
          review_count: number;
          created_by: string;
          created_at: string;
          updated_at: string;
          distance_meters: number;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
