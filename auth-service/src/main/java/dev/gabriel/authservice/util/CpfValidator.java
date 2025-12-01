package dev.gabriel.authservice.util;

public class CpfValidator {

    /**
     * Valida um CPF de forma profissional.
     * @param cpf valor de entrada (pode ter pontos e traços)
     * @return boolean indicando se o CPF é válido
     */
    public static boolean isValidCPF(String cpf) {

        if (cpf == null) return false;

        // Remove tudo que não for número
        cpf = cpf.replaceAll("\\D", "");

        // Deve ter 11 dígitos
        if (cpf.length() != 11) return false;

        // Não pode ser sequência repetida
        if (cpf.matches("(\\d)\\1{10}")) return false;

        try {
            // Calcula primeiro dígito verificador
            int sum = 0;
            for (int i = 0; i < 9; i++) {
                sum += Character.getNumericValue(cpf.charAt(i)) * (10 - i);
            }
            int firstCheck = 11 - (sum % 11);
            if (firstCheck >= 10) firstCheck = 0;

            // Confere primeiro DV
            if (firstCheck != Character.getNumericValue(cpf.charAt(9))) return false;

            // Calcula segundo dígito verificador
            sum = 0;
            for (int i = 0; i < 10; i++) {
                sum += Character.getNumericValue(cpf.charAt(i)) * (11 - i);
            }
            int secondCheck = 11 - (sum % 11);
            if (secondCheck >= 10) secondCheck = 0;

            // Confere segundo DV
            return secondCheck == Character.getNumericValue(cpf.charAt(10));

        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Normaliza CPF (remove pontos, traços e espaços)
     */
    public static String normalize(String cpf) {
        if (cpf == null) return null;
        return cpf.replaceAll("\\D", "");
    }
}
